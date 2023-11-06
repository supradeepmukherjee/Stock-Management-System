import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    let { action, slug, qty } = await request.json()
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri)
    try {
        const db = client.db("stock")
        const inventory = db.collection('inventory')
        const filter = { slug }
        let newQty = action == 'dec' ? (qty - 1) : (qty + 1)
        const updateDoc = { $set: { qty: newQty } }
        const result = await inventory.updateOne(filter, updateDoc, {})
        return NextResponse.json({ msg: `${result.matchedCount} doc(s) matched the filter, updated ${result.modifiedCount} doc(s)`, ok: true })
    } finally {
        await client.close();
    }
}