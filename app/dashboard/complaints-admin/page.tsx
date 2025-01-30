import PageHeader from "@/components/atoms/PageHeader";
import ComplaintsUpload from "@/components/molecules/ComplaintsUpload";
import ComplaintsList from "@/components/molecules/ComplaintsList";

export default async function page() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Zarządzanie reklamacjami" />
      <ComplaintsUpload />
      <ComplaintsList />
    </div>
  );
}
