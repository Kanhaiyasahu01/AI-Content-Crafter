'use client'
import React, { useContext, useState } from 'react'
import SideNav from './_components/SideNav';
import Header from './_components/Header';
import { totalUsageContext } from '../(context)/TotalUsageContext';
import { UserSubscriptionContext } from '../(context)/UserSubscritptionContext';
import { UpdateCreditUsageContext } from '../(context)/UpdateCreditUsageContext';


const layout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
    

    const [totalUsage,setTotalUsage] = useState<Number>(0);
    const [userSubscription,setUserSubscription] = useState<boolean>(false);
    const [updateCreditUsage,setUpdateCreditUsage] = useState<any>()


  return (
  <totalUsageContext.Provider value={{totalUsage,setTotalUsage}}>
    <UserSubscriptionContext.Provider value={{userSubscription,setUserSubscription}}>
      <UpdateCreditUsageContext.Provider value={{updateCreditUsage,setUpdateCreditUsage}}>
    <div className='bg-slate-10

    0 h-screen '>
        <div className='md:w-64 hidden md:block fixed'>
            <SideNav />
        </div>
        <div className='md:ml-64'>
          <Header />
        {children}
        </div>

    </div>
    </UpdateCreditUsageContext.Provider>
    </UserSubscriptionContext.Provider>
  </totalUsageContext.Provider>
  )
}

export default layout