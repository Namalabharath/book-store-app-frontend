const getBaseUrl = () => {
    // Use local backend for development
    //return "http://localhost:5000/api"
    
    // Use this for production
     return "https://book-store-app-backend-vj4x.onrender.com/api"
}

export default getBaseUrl;
