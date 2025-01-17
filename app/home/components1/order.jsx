'use client'

import { useEffect, useState } from 'react'
import { db, auth } from '@/firebase'
import { collection, getDocs, query, orderBy, where } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package2 } from 'lucide-react'

export default function OrderPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalSpent, setTotalSpent] = useState(0)

  useEffect(() => {
    async function getOrders() {
      try {
        const user = auth.currentUser
        if (!user) return

        const purchasesRef = collection(db, "purchases")
        const q = query(
          purchasesRef,
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc")
        )
        const querySnapshot = await getDocs(q)
        
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        setOrders(ordersData)
        const total = ordersData.reduce((sum, order) => sum + Number(order.totalAmount), 0)
        setTotalSpent(total)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    getOrders()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card className="mb-8 bg-zinc-900/50 border-zinc-800">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-purple-400">Total Spent</p>
              <h2 className="text-3xl font-bold text-purple-500">₹{totalSpent.toFixed(2)}</h2>
            </div>
            <div>
              <p className="text-sm font-medium text-green-400">Total Orders</p>
              <h2 className="text-3xl font-bold text-green-500">{orders.length}</h2>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 mb-8">
        <Package2 className="h-6 w-6 text-purple-500" />
        <h1 className="text-2xl font-bold">Order History</h1>
      </div>
      
      <div className="flex flex-col h-screen rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 overflow-y-auto">
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-purple-400">{order.stockName}</CardTitle>
                    <CardDescription>
                      {new Date(order.timestamp.seconds * 1000).toLocaleString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: 'Asia/Kolkata'
                      })}
                    </CardDescription>
                  </div>
                  <span className="text-lg font-bold text-green-500">
                    ₹{Number(order.totalAmount).toFixed(2)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-zinc-400">Quantity:</span>
                    <span className="ml-2 font-medium text-purple-400">{order.quantity}</span>
                  </div>
                  <div className="flex justify-end">
                    <span className="text-zinc-400">Price per unit:</span>
                    <span className="ml-2 font-medium text-purple-400">₹{Number(order.price).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {orders.length === 0 && (
            <div className="text-center py-8 text-zinc-400">
              No orders found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

