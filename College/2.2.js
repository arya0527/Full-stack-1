const products = [
    {"name":"Tshirt", "category":"Clothing"},
    {"name":"Headphones", "category":"Electronics"},
    {"name":"HarryPotter", "category":"Books"},
    {"name":"Iphone", "category":"Electronics"}];
const productList = document.getElementById("product-list");
const Categoryfilter = document.getElementById("category-filter");
 let filteredProducts = " ";
function filterProducts(){
    const selectCategory = Categoryfilter.value;
    if(selectCategory === "All"){
        filteredProducts(products);
    }else{
        filteredProducts = products.filter(product => product.category === selectCategory);
        filteredProducts.forEach((V) => {
            console.log(V.name);
            console.log(V.category);
        });
    renderProducts(filteredProducts);
    }
    
}