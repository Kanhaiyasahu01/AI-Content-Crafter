"use client";
import React, { useEffect, useState } from "react";
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

  const selectedTemplate: TEMPLATE | undefined = Templates?.find(
    (item) => item.slug === params["template-slug"] 
   );


  const GenerateAIContent = async(formData: any) => {
    setLoading(true)
    const selectedPrompt = selectedTemplate?.aiPrompt;

    const finalAIPrompt = JSON.stringify(formData)+", "+selectedPrompt;

    const result = await  chatSession.sendMessage(finalAIPrompt);

    // console.log(result.response.text());
    setAIOutput(result?.response.text());
    // await saveInDb(formData,selectedTemplate?.slug,result?.response.text())
    setLoading(false);
  };

  // const saveInDb = async(formData:any,slug:any,aiResp:string)=>{
  //   const result = await db.insert(AiOutput).values({
  //     formData:formData,
  //     templateSlug:slug,
  //     aiResponse:aiResp,
  //     createdBy:user?.primaryEmailAddress?.emailAddress,
  //     createdAt: new Date()
  //   });


  // }

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
