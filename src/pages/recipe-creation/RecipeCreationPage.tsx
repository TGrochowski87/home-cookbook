import CustomInput from "components/CustomInput";
import "./styles.less";
import { useState } from "react";

interface RecipeData {
  readonly name: string;
}

interface RecipeCreationPageProps {}

const RecipeCreationPage = ({}: RecipeCreationPageProps) => {
  const [formData, setFormData] = useState<RecipeData>({
    name: "",
  });

  return (
    <div className="page-layout-column recipe-creation-page">
      <h1>Nowy przepis</h1>
      <CustomInput
        value={formData.name}
        onChange={event => setFormData(prev => ({ ...prev, name: event.target.value }))}
      />
    </div>
  );
};

export default RecipeCreationPage;
