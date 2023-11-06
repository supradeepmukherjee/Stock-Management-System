import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const query = request.nextUrl.searchParams.get('query')
    const uri = process.env.MONGO_URI
    const client = new MongoClient(uri)
    try {
        const db = client.db("stock")
        const inventory = db.collection('inventory')
        const allProducts = await inventory.aggregate([{ $match: { $or: [{ slug: { $regex: query, $options: 'i' } }] } }]).toArray()
        return NextResponse.json({ allProducts, ok: true })
    } finally {
        await client.close();
    }
}
