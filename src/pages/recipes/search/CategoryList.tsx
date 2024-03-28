import CategoryChip from "components/chips/CategoryChip";

interface CategoryListProps {}

const CategoryList = ({}: CategoryListProps) => {
  return (
    <div className="category-list">
      <CategoryChip name="dsf" activeColor="purple" />
      <CategoryChip name="Teasdgagst" activeColor="red" />
      <CategoryChip name=" asd f" activeColor="blue" />
      <CategoryChip name=" sdfas" activeColor="orange" />
      <CategoryChip name="sadfsag" activeColor="lightblue" />
    </div>
  );
};

export default CategoryList;
