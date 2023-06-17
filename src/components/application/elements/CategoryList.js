import Category from './Category';

export default function CategoryList({categories}) {
  if(categories.length < 1) return null;
  
  return categories.map((item, key) => (
     <Category category={item} key={key} />
  ));
}
