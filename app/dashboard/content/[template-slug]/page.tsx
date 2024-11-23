"use client";
import React, { useContext, useEffect, useState } from "react";
import FormSection from "../_components/FormSection";
import OutputSection from "../_components/OutputSection";
import { TEMPLATE } from "../../_components/TemplateListSection";
import Templates from "@/app/(data)/Template";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { chatSession } from "@/utils/AiModel";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import { AIOutput } from "@/utils/schema";
import { timestamp } from "drizzle-orm/mysql-core";
import moment from "moment";
import { totalUsageContext } from "@/app/(context)/TotalUsageContext";
import { useRouter } from "next/router";
import { UserSubscriptionContext } from "@/app/(context)/UserSubscritptionContext";
import { UpdateCreditUsageContext } from "@/app/(context)/UpdateCreditUsageContext";
interface PROPS {
  params: {
    "template-slug": string;
  };
}
const CreateNewContent =  (props: PROPS) => {
  const params = useParams();

  const [loading,setLoading] = useState(false);
  const [aiOutput,setAIOutput] = useState<string>("");
  const {user}= useUser();
  const {userSubscription,setUserSubscription} = useContext(UserSubscriptionContext);
  const {updateCreditUsage,setUpdateCreditUsage} = useContext(UpdateCreditUsageContext);


  const selectedTemplate: TEMPLATE | undefined = Templates?.find(
    (item) => item.slug === params["template-slug"] 
   );

  //  const router = useRouter();
   const {totalUsage, setTotalUsage} = useContext(totalUsageContext)

  const GenerateAIContent = async(formData: any) => {
    if(totalUsage>=10000 && !userSubscription){
      alert("All credits are used, please upgrade your plan");
      // router.push('/dashboard/billing')
      return;
    }
    setLoading(true)
    const selectedPrompt = selectedTemplate?.aiPrompt;

    const finalAIPrompt = JSON.stringify(formData)+", "+selectedPrompt;

    const result = await  chatSession.sendMessage(finalAIPrompt);

    // console.log(result.response.text());
    setAIOutput(result?.response.text());
    await saveInDb(formData,selectedTemplate?.slug,result?.response.text())
    setLoading(false);

    setUpdateCreditUsage(Date.now())
  };

  const saveInDb = async(formData:any,slug:any,aiResp:string)=>{
    const result = await db.insert(AIOutput).values({
      formData:formData,
      templateSlug:slug,
      aiResponse:aiResp,
      createdBy:user?.primaryEmailAddress?.emailAddress,
      createdAt:moment().format('DD/MM/YYYY')
    });

    console.log("saved to db");
    console.log(result);

  }

  return (
    <div className="p-10">
      <Link href={'/dashboard'}>
      <Button><ArrowLeft />Back  </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-5">
        {/* FormSection */}
        <FormSection
          selectedTemplate={selectedTemplate}
          userFormInput={(v: any) => GenerateAIContent(v)}
          loading={loading}
        />

        {/* OutputSection */}
        <div className="col-span-2">
          <OutputSection aiOutput={aiOutput} />
        </div>
      </div>
    </div>
  );
};

export default CreateNewContent;
