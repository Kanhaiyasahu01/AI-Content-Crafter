'use client'
import { UserSubscriptionContext } from "@/app/(context)/UserSubscritptionContext";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { UserSubscription } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import moment from "moment";
import Script from "next/script";
import React, { useContext, useState } from "react";

const Billing = () => {

  const [loading,setLoading] = useState(false);
  const {user} = useUser();
  const {userSubscription,setUserSubscription} = useContext(UserSubscriptionContext);


  const createSubscription= ()=>{
    console.log("start");
    setLoading(true);
    axios.post('/api/create-subscription',{})
    .then(resp=>{
      console.log("print subscription id");
      console.log(resp.data);
      onPayment(resp.data.id)
    },(error)=>{
      setLoading(false);
    })

  }

  const onPayment=(subId:string)=>{
      const options ={
        "key":process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        "subscription_id":subId,
        "name":"Kanhaiya AI Apps",
        description:"Monthly subscription",
        handler:async(res:any)=>{
          console.log(res);
          if(res){
            {saveSubscription(res?.razorpay_payment_id)}
          }
          setLoading(false);
        }
      }

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();

  }

  const saveSubscription = async(paymentId:string)=>{
console.log(" i am inside save subscription");
    const result =await db.insert(UserSubscription)
    .values({
      email:user?.primaryEmailAddress?.emailAddress,
      username:user?.fullName,
      active:true,
      paymentId:paymentId,
      joinDate:moment().format('DD/MM/yyyy'),
    });
    console.log(result);

    if(result){
      window.location.reload();
    }
  }

  return (
    <div className="flex flex-col items-center justify-center  bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Upgrade With Monthly Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        {/* Free Plan */}
        <div className="p-6 bg-white shadow-md rounded-lg border border-gray-300">
          <h2 className="text-2xl font-bold mb-4">Free</h2>
          <p className="text-4xl font-bold mb-4">0$<span className="text-lg font-medium">/month</span></p>
          <ul className="mb-6">
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✔</span>
              <span>10,000 Words/Month</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✔</span>
              <span>50+ Content Templates</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✔</span>
              <span>Unlimited Download & Copy</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✔</span>
              <span>1 Month of History</span>
            </li>
          </ul>
          <button className="w-full py-2 px-4 bg-gray-800 text-white font-semibold rounded-lg">
            Currently Active Plan
          </button>
        </div>

        {/* Monthly Plan */}
        <div className="p-6 bg-white shadow-md rounded-lg border border-gray-300">
          <h2 className="text-2xl font-bold mb-4">Monthly</h2>
          <p className="text-4xl font-bold mb-4">
          ₹100<span className="text-lg font-medium">/month</span>
          </p>
          <ul className="mb-6">
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✔</span>
              <span>1,00,000 Words/Month</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✔</span>
              <span>50+ Template Access</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✔</span>
              <span>Unlimited Download & Copy</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✔</span>
              <span>1 Year of History</span>
            </li>
          </ul>
          <button 
          disabled={loading}
          onClick={()=>createSubscription()}
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 flex gap-2 items-center">
            {loading && <Loader2Icon className="animate-spin"/>}

          {userSubscription? "Active Plan" : "Get Started"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Billing;
