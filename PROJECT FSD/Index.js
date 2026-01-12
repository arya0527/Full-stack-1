// --- Imports ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { execFile } = require('child_process'); // To run external scripts
const path = require('path'); // To build file paths
 
// --- Config ---
// Load environment variables from .env file
dotenv.config();
 
// --- App Initialization ---
const app = express();
// Use a different port than the default 3000 (which React often uses)
const PORT = process.env.PORT || 5001;
 
// --- Middlewares ---
// Enable Cross-Origin Resource Sharing for all routes
app.use(cors());
// Enable parsing of JSON request bodies
app.use(express.json());
 
// --- Mongoose Schemas (As requested) ---
 
/**
 * Item Schema (Represents a Movie)
 * Based on the MovieLens u.item file
 */
const itemSchema = new mongoose.Schema({
    // 'itemId' will be the movie ID from the dataset (e.g., "1")
    itemId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    // 'title' will be the movie title (e.g., "Toy Story (1995)")
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    }
});
 
/**
 * Interaction Schema (Represents a Rating)
 * Based on the MovieLens u.data file
 */
const interactionSchema = new mongoose.Schema({
    // 'userId' from the dataset (e.g., "196")
    userId: {
        type: String,
        required: true,
        index: true
    },
    // 'itemId' links to the Item model (e.g., "242")
    itemId: {
        type: String,
        required: true,
        index: true
    },
    // 'rating' from the dataset (e.g., 3)
    rating: {
        type: Number,
        required: true
    },
    // 'timestamp' from the dataset
    timestamp: {
        type: Number
    }
});
 
// --- Mongoose Models ---
// Mongoose will create collections named 'items' and 'interactions' in MongoDB
const Item = mongoose.model('Item', itemSchema);
const Interaction = mongoose.model('Interaction', interactionSchema);
 
// Export models so your other scripts (like seed.js) can use them
module.exports = { Item, Interaction };
 
// --- Basic Test Route ---
// You can visit http://localhost:5001 in your browser to check
app.get('/', (req, res) => {
    res.send('Backend server is alive!');
});
 
// --- API Routes ---
 
/**
 * GET /api/items
 * Returns a paginated list of all movies.
 * Query params: ?page=1&limit=20
 */
app.get('/api/items', async (req, res) => {
    try {
        // Get page and limit from query, with default values
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
 
        // Fetch paginated items from the database
        const items = await Item.find()
            .skip(skip)
            .limit(limit);
 
        // Get total count for pagination metadata
        const totalItems = await Item.countDocuments();
 
        // Send the response
        res.json({
            data: items,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalItems / limit),
                totalItems: totalItems,
            }
        });
    } catch (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ error: 'Server error while fetching items' });
    }
});
 
/**
 * GET /api/items/popular
 * Returns the 10 most-rated items (cold-start fallback).
 */
app.get('/api/items/popular', async (req, res) => {
    try {
        // This is an "aggregation pipeline"
        const popularItems = await Interaction.aggregate([
            // 1. Group by itemId and count how many ratings each one has
            {
                $group: {
                    _id: '$itemId', // Group by the item's ID
                    ratingCount: { $sum: 1 } // Count 1 for each interaction
                }
            },
            // 2. Sort by the new 'ratingCount' field, highest first
            { $sort: { ratingCount: -1 } },
            // 3. Take only the top 10
            { $limit: 10 },
            // 4. Join with the 'items' collection to get movie details
            {
                $lookup: {
                    from: 'items',       // The collection name for the Item model
                    localField: '_id',   // The field from this pipeline (Interaction's itemId)
                    foreignField: 'itemId', // The matching field in the 'items' collection
                    as: 'itemDetails'    // Name of the new array field to add
                }
            },
            // 5. Unpack the 'itemDetails' array
            { $unwind: '$itemDetails' },
            // 6. Clean up the output
            {
                $project: {
                    _id: 0, // Hide the complex _id
                    itemId: '$_id',
                    title: '$itemDetails.title',
                    ratingCount: '$ratingCount',
                    imageUrl: "$itemDetails.imageUrl"
                }
            }
        ]);
 
        res.json(popularItems);
 
    } catch (err) {
        console.error('Error fetching popular items:', err);
        res.status(500).json({ error: 'Server error while fetching popular items' });
    }
});
 
/**
 * GET /api/item/:itemId
 * Returns the details for a single item (movie).
 */
app.get('/api/item/:itemId', async (req, res) => {
    try {
        const { itemId } = req.params;
       
        // Find one item in the database that matches the itemId
        const item = await Item.findOne({ itemId: itemId });
 
        if (!item) {
            // If no item is found, send a 404 error
            return res.status(404).json({ error: 'Item not found' });
        }
 
        // If found, send the item's details
        res.json(item);
 
    } catch (err) {
        console.error('Error fetching single item:', err);
        res.status(500).json({ error: 'Server error' });
    }
});
 
/**
 * GET /api/recommendations/:userId
 * Triggers the Python ML script to get recommendations.
 */
app.get('/api/recommendations/:userId', async (req, res) => {
    const { userId } = req.params;
 
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
 
    // --- Define paths for the Python script ---
   
    // Path to the Python executable inside your virtual environment
    const pythonExecutable = path.join(
        __dirname, // Current /backend folder
        '..',      // Go up one level to project root
        'ml-services', // Go into /ml-services
        'venv',    // Go into /venv
        'Scripts', // Go into /Scripts (for Windows)
        'python.exe'   // The executable
    );
 
    // Path to your predict.py script
    const scriptPath = path.join(
        __dirname,
        '..',
        'ml-services',
        'predict.py'
    );
 
    console.log(`Running Python script: ${pythonExecutable} ${scriptPath} ${userId}`);
 
    // --- 1. DEFINE THE WORKING DIRECTORY ---
    const mlServicesDir = path.join(
        __dirname,
        '..',
        'ml-services'
    );
 
    try {
        // --- Run the Python Script ---
 
        // --- 2. ADD THE `cwd` OPTION ---
        execFile(pythonExecutable, [scriptPath, userId], { cwd: mlServicesDir }, async (error, stdout, stderr) => {
            if (error) {
                console.error('execFile error:', error);
                console.error('Python stderr:', stderr); // Log Python errors
                return res.status(500).json({ error: 'Error running recommendation script', details: stderr });
            }
 
            console.log('Python script stdout:', stdout);
 
            // --- Process the Script Output ---
            let itemIds;
            try {
                // The script's *only* output to stdout is the JSON array
                itemIds = JSON.parse(stdout);
            } catch (parseError) {
                console.error('Error parsing JSON from Python:', parseError);
                return res.status(500).json({ error: 'Error parsing script output' });
            }
 
            if (!Array.isArray(itemIds) || itemIds.length === 0) {
                // No recommendations found
                return res.json([]);
            }
 
            // --- Fetch Movie Details from MongoDB ---
            const recommendations = await Item.find({
                'itemId': { $in: itemIds }
            });
 
            // Re-sort the database results to match the ML model's ranked order
            const sortedRecommendations = recommendations
                .slice() // Create a copy
                .sort((a, b) => itemIds.indexOf(a.itemId) - itemIds.indexOf(b.itemId));
 
            // Send the final, sorted list of movie objects
            res.json(sortedRecommendations);
        });
 
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
 
//
// ⭐️ ----- THIS IS THE CORRECT PLACE FOR THE NEW ROUTES ----- ⭐️
//
 
/**
 * ⭐️ NEW ⭐️
 * GET /api/search
 * Searches for movies by title.
 * Query: ?q=...
 */
app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q;
 
        if (!query) {
            return res.status(400).json({ error: 'Search query "q" is required' });
        }
 
        // Use the $text index to search.
        // $meta:"textScore" ranks them by relevance.
        // We also filter for items that HAVE an imageUrl to avoid bad data
        const items = await Item.find(
            {
                $text: { $search: query },
                imageUrl: { $exists: true }
            },
            { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } }).limit(20); // Get top 20 results
 
        res.json(items);
 
    } catch (err) {
        console.error('Error searching items:', err);
        res.status(500).json({ error: 'Server error during search' });
    }
});
 
/**
 * ⭐️ NEW ⭐️
 * GET /api/recommendations/item/:itemId
 * Gets "related" movies (item-based recommendations).
 */
app.get('/api/recommendations/item/:itemId', async (req, res) => {
    const { itemId } = req.params;
 
    if (!itemId) {
        return res.status(400).json({ error: 'Item ID is required' });
    }
 
    // --- Define paths (same as your other endpoint) ---
    const pythonExecutable = path.join(__dirname, '..', 'ml-services', 'venv', 'Scripts', 'python.exe');
   
    // Call the NEW script: neighbors.py
    const scriptPath = path.join(__dirname, '..', 'ml-services', 'neighbors.py');
    const mlServicesDir = path.join(__dirname, '..', 'ml-services');
 
    console.log(`Running Python script: ${pythonExecutable} ${scriptPath} ${itemId}`);
 
    try {
        execFile(pythonExecutable, [scriptPath, itemId], { cwd: mlServicesDir }, async (error, stdout, stderr) => {
            if (error) {
                console.error('execFile error:', error);
                console.error('Python stderr:', stderr);
                return res.status(500).json({ error: 'Error running related script', details: stderr });
            }
 
            console.log('Python script stdout:', stdout);
           
            let itemIds;
            try {
                itemIds = JSON.parse(stdout);
            } catch (parseError) {
                return res.status(500).json({ error: 'Error parsing script output' });
            }
 
            if (!Array.isArray(itemIds) || itemIds.length === 0) {
                return res.json([]);
            }
 
            // Fetch movie details from MongoDB
            const recommendations = await Item.find({ 'itemId': { $in: itemIds } });
 
            // Re-sort them to match the ML model's order
            const sortedRecommendations = recommendations
                .slice()
                .sort((a, b) => itemIds.indexOf(a.itemId) - itemIds.indexOf(b.itemId));
 
            res.json(sortedRecommendations);
        });
 
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
 
// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI;
 
if (!MONGO_URI) {
    console.error("FATAL ERROR: MONGO_URI is not defined in your .env file.");
    process.exit(1); // Exit the app if the DB connection string is missing
}
 
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully.');
 
        // --- Start Server ---
        // Only start the server *after* the DB connection is successful
        app.listen(PORT, () => {
            console.log(`Backend server running on http://localhost:${PORT}`);
        });
 
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
   
    });
 
// ❗️❗️ THE DUPLICATE ROUTES YOU PASTED AT THE BOTTOM HAVE BEEN REMOVED. ❗️❗️
