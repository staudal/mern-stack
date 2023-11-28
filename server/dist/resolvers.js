import db from "./db/conn.js";
import { ObjectId } from "mongodb";
const resolvers = {
    Wishlist: {
        id: (parent) => parent.id ?? parent._id,
        wishes: async (parent) => {
            let collection = await db.collection("wishes");
            let wishes = await collection.find({ wishlist_id: new ObjectId(parent.id ?? parent._id) }).toArray();
            return wishes;
        },
    },
    Wish: {
        id: (parent) => parent.id ?? parent._id,
    },
    Query: {
        async wishlist(_, { id }) {
            let collection = await db.collection("wishlists");
            let query = { _id: new ObjectId(id) };
            return await collection.findOne(query);
        },
        async wishlists(_, __) {
            let collection = await db.collection("wishlists");
            const wishlists = await collection.find({}).toArray();
            return wishlists;
        },
        wishlistsByUser: async (_, { user_id }) => {
            let collection = await db.collection("wishlists");
            const wishlists = await collection.find({ user_id }).toArray();
            return wishlists;
        },
        async wish(_, { id }) {
            let collection = await db.collection("wishes");
            let query = { _id: new ObjectId(id) };
            return await collection.findOne(query);
        },
        async wishes(_, __) {
            let collection = await db.collection("wishes");
            const wishes = await collection.find({}).toArray();
            return wishes;
        },
        async wishesByWishlist(_, { wishlist_id }) {
            let collection = await db.collection("wishes");
            const wishes = await collection.find({ wishlist_id: new ObjectId(wishlist_id) }).toArray();
            return wishes;
        },
    },
    Mutation: {
        async createWishlist(_, { name, user_id }) {
            let collection = await db.collection("wishlists");
            const date_created = new Date();
            const insert = await collection.insertOne({ name, user_id, date_created });
            if (insert.acknowledged)
                return { name, user_id, date_created, id: insert.insertedId };
            return null;
        },
        async updateWishlist(_, args) {
            const id = new ObjectId(args.id);
            let query = { _id: new ObjectId(id) };
            let collection = await db.collection("wishlists");
            const update = await collection.updateOne(query, { $set: { ...args } });
            if (update.acknowledged)
                return await collection.findOne(query);
            return null;
        },
        async deleteWishlist(_, { id }) {
            let collection = await db.collection("wishlists");
            const dbDelete = await collection.deleteOne({ _id: new ObjectId(id) });
            return dbDelete.acknowledged && dbDelete.deletedCount == 1 ? true : false;
        },
        async createWish(_, { wishlist_id, name, description, price, link, img_url }) {
            let collection = await db.collection("wishes");
            let insert = await collection.insertOne({ wishlist_id: new ObjectId(wishlist_id), name, description, price, link, img_url });
            if (insert.acknowledged)
                return { wishlist_id, name, description, price, link, img_url, id: insert.insertedId };
            return null;
        },
        async updateWish(_, args) {
            const id = new ObjectId(args.id);
            let query = { _id: new ObjectId(id) };
            let collection = await db.collection("wishes");
            const update = await collection.updateOne(query, { $set: { ...args } });
            if (update.acknowledged)
                return await collection.findOne(query);
            return null;
        },
        async deleteWish(_, { id }) {
            let wishesCollection = await db.collection("wishes");
            // Find the wish to get the wishlist_id
            const wish = await wishesCollection.findOne({ _id: new ObjectId(id) });
            if (!wish) {
                throw new Error("Wish not found");
            }
            // Delete the wish
            const dbDelete = await wishesCollection.deleteOne({ _id: new ObjectId(id) });
            if (dbDelete.acknowledged && dbDelete.deletedCount == 1) {
                return true;
            }
            return false;
        },
    },
};
export default resolvers;
//# sourceMappingURL=resolvers.js.map