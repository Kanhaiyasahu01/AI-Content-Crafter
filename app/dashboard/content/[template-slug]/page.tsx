"use client";
import React, { useContext, useState } from "react";
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
import moment from "moment";
import { totalUsageContext } from "@/app/(context)/TotalUsageContext";
import { UpdateCreditUsageContext } from "@/app/(context)/UpdateCreditUsageContext";

const CreateNewContent = () => {
  const params = useParams() as { "template-slug": string };

  const [loading, setLoading] = useState(false);
  const [aiOutput, setAIOutput] = useState<string>("");
  const { user } = useUser();
  const { updateCreditUsage, setUpdateCreditUsage } = useContext(UpdateCreditUsageContext);

  const selectedTemplate: TEMPLATE | undefined = Templates?.find(
    (item) => item.slug === params["template-slug"]
  );

  const GenerateAIContent = async (formData: any) => {
    setLoading(true);
    const selectedPrompt = selectedTemplate?.aiPrompt;
    const finalAIPrompt = JSON.stringify(formData) + ", " + selectedPrompt;

    const result = await chatSession.sendMessage(finalAIPrompt);
    setAIOutput(result?.response.text());
    await saveInDb(formData, selectedTemplate?.slug, result?.response.text());
    setLoading(false);
    setUpdateCreditUsage(Date.now());
  };

  const saveInDb = async (formData: any, slug: any, aiResp: string) => {
    await db.insert(AIOutput).values({
      formData,
      templateSlug: slug,
      aiResponse: aiResp,
      createdBy: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().format("DD/MM/YYYY"),
    });
  };

  return (
    <div className="p-10">
      <Link href="/dashboard">
        <Button>
          <ArrowLeft /> Back
        </Button>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-5">
        <FormSection
          selectedTemplate={selectedTemplate}
          userFormInput={(v: any) => GenerateAIContent(v)}
          loading={loading}
        />
        <div className="col-span-2">
          <OutputSection aiOutput={aiOutput} />
        </div>
      </div>
    </div>
  );
};

export default CreateNewContent;
