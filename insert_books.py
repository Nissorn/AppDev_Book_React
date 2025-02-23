from pymongo import MongoClient

# Connect to MongoDB
MONGO_URI = "mongodb+srv://new_user:kNr9VKfT45gXS9EC@mycluster.z2n0s.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster"
client = MongoClient(MONGO_URI)

db = client["bookstore"]  # Database name
collection = db["books"]  # Collection name

books = [
    {"title": "The Let Them Theory", "author": "Mel Robbins", "image_url": "https://images-na.ssl-images-amazon.com/images/I/91I1KDnK1kL._AC_UL381_SR381,381_.jpg"},
    {"title": "Forgotten Home Apothecary", "author": "Dr. Nicole Apelian", "image_url": "https://images-na.ssl-images-amazon.com/images/I/91-E86oM2IL._AC_UL381_SR381,381_.jpg"},
    {"title": "Seven Things You Can't Say About China", "author": "Tom Cotton", "image_url": "https://images-na.ssl-images-amazon.com/images/I/81+mN748qkL._AC_UL381_SR381,381_.jpg"},
    {"title": "Atomic Habits", "author": "James Clear", "image_url": "https://images-na.ssl-images-amazon.com/images/I/81ANaVZk5LL._AC_UL381_SR381,381_.jpg"}
]

result = collection.insert_many(books)
print("Inserted IDs:", result.inserted_ids)
