export default async function Groups() {
  const data = await fetch("/api/tableland/").then((res) =>
    res.json()
  );
  
  return (
    <div>Groups</div>
  )
}


