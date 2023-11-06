import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const uri = process.env.MONGO_URI
    const client = new MongoClient(uri)
    try {
        const db = client.db("stock")
        const inventory = db.collection('inventory')
        const query = {}
        const allProducts = await inventory.find(query).toArray()
        return NextResponse.json({ allProducts, ok: true })
    } finally {
        await client.close();
    }
}
export async function POST(request) {
    let body = await request.json()
    const uri = process.env.MONGO_URI
    const client = new MongoClient(uri)
    try {
        const db = client.db("stock")
        const inventory = db.collection('inventory')
        const product = await inventory.insertOne(body)
        return NextResponse.json({ product, ok: true })
    } finally {
        await client.close();
    }
}