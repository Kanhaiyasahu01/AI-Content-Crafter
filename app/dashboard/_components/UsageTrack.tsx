'use client'
import { totalUsageContext } from '@/app/(context)/TotalUsageContext';
import { UpdateCreditUsageContext } from '@/app/(context)/UpdateCreditUsageContext';
import { UserSubscriptionContext } from '@/app/(context)/UserSubscritptionContext';
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db';
import { AIOutput, UserSubscription } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import React, { useContext, useEffect, useState } from 'react';

const UsageTrack = () => {
  const { user } = useUser();
  const {totalUsage, setTotalUsage} = useContext(totalUsageContext);
  const {userSubscription,setUserSubscription} = useContext(UserSubscriptionContext);
  const [maxWords,setMaxWords] = useState(10000);
  const {updateCreditUsage,setUpdateCreditUsage} = useContext(UpdateCreditUsageContext);


  useEffect(() => {
    if (user) {
      getData();
      isUserSubscribed();
    }
  }, [user]);

  useEffect(()=>{
     user&&getData();
  },[updateCreditUsage&&user]);


  const getData = async () => {
    const email = user?.primaryEmailAddress?.emailAddress || ''; // Use empty string if undefined
  
    const result = await db
      .select()
      .from(AIOutput)
      .where(eq(AIOutput.createdBy, email)); 
  
    GetTotalUsage(result);
  };
  
  const isUserSubscribed= async()=>{
    const result = await db.select().from(UserSubscription)
    // @ts-ignore
    .where(eq(UserSubscription.email,user?.primaryEmailAddress?.emailAddress))

    console.log("db result",result);
    if(result.length>0){
      setUserSubscription(true);
      setMaxWords(100000);
    }
  }
  const GetTotalUsage = (result: any) => {
    let total: number = 0;

    // Loop through the results and sum up the character length of aiResponse
    result.forEach((element: any) => {
      total = total + (element.aiResponse?.length || 0);
    });

    setTotalUsage(total); // Update state with the total usage
  };


  return (
    <div className='m-5'>
      <div className='bg-primary text-white rounded-lg p-3'>
        <h2 className='font-medium'>Credits</h2>
        <div className='h2 bg-[#9981f9] w-full rounded-full mt-3'>
          <div
            className='h-2 bg-white rounded-full'
            style={{
              width: (totalUsage / maxWords) * 100 + '%', // Calculate the percentage of usage
            }}
          />
        </div>

        <h2 className='text-sm my-1'>{totalUsage}/{maxWords} credit used</h2>
      </div>

      <Button variant={'secondary'} className='w-full my-3 text-primary'>
        Upgrade
      </Button>
    </div>
  );
}

export default UsageTrack;
