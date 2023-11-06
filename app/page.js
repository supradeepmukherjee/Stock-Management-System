"use client"
import Header from '@/components/Header'
import Image from 'next/image'
import { useEffect, useState } from 'react';


export default function Home() {
  const h1Style = {
    fontSize: '24px',      // Adjust font size as needed
    color: '#333',         // Text color
    marginBottom: '20px',  // Add some spacing below the h1 tags
    fontWeight: 'bold'
  };
  const addProduct = async e => {
    e.preventDefault()
    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productForm),
      });
      if (response.ok) {
        setAlert('product added successfully')
        setProductForm({})
      } else {
        // Handle error cases
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleChange = e => setProductForm({ ...productForm, [e.target.name]: e.target.value })
  const [productForm, setProductForm] = useState({})
  const [products, setProducts] = useState([])
  const [alert, setAlert] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [dropdown, setDropdown] = useState([])
  const [suggestion, setSuggestion] = useState(false)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetching = await fetch('/api/product', { method: 'GET' });
        const response = await fetching.json()
        if (response.ok) {
          setProducts(response.allProducts)
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    fetchProducts()
  }, [])
  const handleDropDown = async e => {
    try {
      setQuery(e.target.value)
      if (!loading) {
        setLoading(true)
        const fetching = await fetch(`/api/search?query=${query}`, { method: 'GET' });
        const response = await fetching.json()
        if (response.ok) {
          setDropdown(response.allProducts)
        } else {
          console.error('Failed to show suggestions');
        }
        setLoading(false)
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  const changeQty = async (action, slug, qty) => {
    let index = products.findIndex(item => item.slug == slug)
    let newQty = JSON.parse(JSON.stringify(products))
    if (action == 'inc') newQty[index].qty = parseInt(qty) + 1
    else newQty[index].qty = parseInt(qty) - 1
    setProducts(newQty)
    let indexDrop = dropdown.findIndex(item => item.slug == slug)
    let newDropdown = JSON.parse(JSON.stringify(dropdown))
    if (action == 'inc') newDropdown[indexDrop].qty = parseInt(qty) + 1
    else newDropdown[indexDrop].qty = parseInt(qty) - 1
    setDropdown(newDropdown)
    setSuggestion(true)
    try {
      const response = await fetch('/api/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, slug, qty }),
      });
      if (response.ok) {
        setAlert('product qty changed successfully')
      } else {
        console.error('Failed to change product qty');
      }
      setSuggestion(false)
    } catch (error) {
      console.error('Error:', error);
    }
  }
  return (
    <>
      <Header />
      <div className="mx-auto container">
        <div className='text-center text-green-600'>
          {alert}
        </div>
        <h1 style={h1Style} onClick={fetch}>Search a Product</h1>
        <div className=" flex mb-2 search-input space-x-4">
          <input type="text" onChange={handleDropDown} placeholder="Enter product name" className='border px-2 w-full  border-gray-300' />
          <select className='border border-gray-300 px-4 py-2 rounded-r-md'>
            <option value="all">All</option>
            <option value="inStock">In Stock</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
          <button className='bg-green-300 px-2 rounded-md'>Search</button>
        </div>
        {loading && 'Loading... Please Wait'}
        <div className="dropContainer absolute border-1 rounded-md w-[75vw] bg-purple-100">
          {dropdown.map(item => {
            return (
              <div className="container flex justify-between p-2 my-1 border-b-2" key={item._id}>
                <span className='search'>{item.slug}: {item.qty} pcs available for Rs. {item.price}</span>
                <div className="mx-5">
                  <button disabled={suggestion} onClick={() => changeQty('dec', item.slug, item.qty)} className="cursor-pointer disabled:bg-purple-200 dec px-3 inline-block py-1 text-white font-semibold bg-purple-400 rounded-full ">-</button>
                  <span className="qty mx-3 inline-block w-3">{item.qty}</span>
                  <button disabled={suggestion} onClick={() => changeQty('inc', item.slug, item.qty)} className="cursor-pointer disabled:bg-purple-200 inc px-3 inline-block py-1 text-white font-semibold bg-purple-400 rounded-full ">+</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="mx-auto container">
        <h1 style={h1Style}>
          Add a Product
        </h1>
        <form action="">
          <div className="mb-4">
            <label htmlFor="productName" className='block mb-2'>
              Product Name(Slug)
            </label>
            <input name='slug' onChange={handleChange} value={productForm?.slug || ''} type="text" id='productName' className='w-full border px-4 py-2 border-gray-300' />
          </div>
          <div className="mb-4">
            <label htmlFor="quantity" className='block mb-2'>
              Quantity
            </label>
            <input name='qty' onChange={handleChange} value={productForm?.qty || ''} type="number" id='quantity' className='w-full border px-4 py-2 border-gray-300' />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className='block mb-2'>
              Price
            </label>
            <input name='price' onChange={handleChange} value={productForm?.price || ''} type="number" id='price' className='w-full border px-4 py-2 border-gray-300' />
          </div>
          <button type="submit" className='bg-blue-500 text-white px-4 py-2' onClick={addProduct}>
            Add Product
          </button>
        </form>
      </div>
      <div className="mx-auto container">
        <h1 style={h1Style}>
          Display Current Stock
        </h1>
        <table className="table-auto w-full">
          <thead>
            <tr className=''>
              <th>Product Name(Slug)</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map(item => (
              <tr key={item.slug}>
                <td className='border px-4 py-2'>{item.slug}</td>
                <td className='border px-4 py-2'>{item.qty}</td>
                <td className='border px-4 py-2'>{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
