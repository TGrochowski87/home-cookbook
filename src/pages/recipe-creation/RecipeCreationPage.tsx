import CustomInput from "components/CustomInput";
import "./styles.less";
import { useState } from "react";
import CustomSelect from "components/CustomSelect";

interface RecipeData {
  readonly name: string;
  readonly category: string;
}

interface RecipeCreationPageProps {}

const RecipeCreationPage = ({}: RecipeCreationPageProps) => {
  const [formData, setFormData] = useState<RecipeData>({
    name: "",
    category: "",
  });

  return (
    <div className="page-layout-column recipe-creation-page">
      <h1>Nowy przepis</h1>
      <CustomInput
        value={formData.name}
        onChange={event => setFormData(prev => ({ ...prev, name: event.target.value }))}
      />
      <CustomSelect />
    </div>
  );
};

export default RecipeCreationPage;
