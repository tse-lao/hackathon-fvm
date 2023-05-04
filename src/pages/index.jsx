import CardTable from '@/components/application/CardTable'
import Stats from '@/components/application/Stats'
import { getToken } from 'next-auth/jwt'
import { getSession } from 'next-auth/react'
import Layout from './Layout'

/* 交流QQ群:75四573778 */
const data = [

  {
    "id": 1,
    "name": "sales_data_2022.csv",
    "type": "CSV",
    "size": "20.5 MB",
    "uploadDate": "2023-04-10T14:30:00.000Z",
    "encrypted": true
  },
  {
    "id": 2,
    "name": "customer_info.xlsx",
    "type": "Excel",
    "size": "5.3 MB",
    "uploadDate": "2023-04-15T09:20:00.000Z",
    "encrypted": true
  },
  {
    "id": 3,
    "name": "product_catalog.pdf",
    "type": "PDF",
    "size": "12.8 MB",
    "uploadDate": "2023-04-18T16:45:00.000Z",
    "encrypted": true
  },
  {
    "id": 4,
    "name": "employee_records.json",
    "type": "JSON",
    "size": "3.7 MB",
    "uploadDate": "2023-04-22T11:15:00.000Z",
    "encrypted": true
  },
  {
    "id": 5,
    "name": "marketing_strategy.pptx",
    "type": "PowerPoint",
    "size": "25.1 MB",
    "uploadDate": "2023-04-25T10:05:00.000Z",
    "encrypted": true
  }, 

    {
      "id": 6,
      "name": "expense_report_2022.csv",
      "type": "CSV",
      "size": "15.8 MB",
      "uploadDate": "2023-04-12T11:20:00.000Z",
      "encrypted": true
    },
    {
      "id": 7,
      "name": "inventory_list.xlsx",
      "type": "Excel",
      "size": "8.4 MB",
      "uploadDate": "2023-04-17T10:50:00.000Z",
      "encrypted": true
    },
    {
      "id": 8,
      "name": "contract_template.pdf",
      "type": "PDF",
      "size": "4.6 MB",
      "uploadDate": "2023-04-19T15:30:00.000Z",
      "encrypted": true
    },
    {
      "id": 9,
      "name": "user_preferences.json",
      "type": "JSON",
      "size": "2.9 MB",
      "uploadDate": "2023-04-23T17:15:00.000Z",
      "encrypted": true
    },
    {
      "id": 10,
      "name": "project_timeline.pptx",
      "type": "PowerPoint",
      "size": "18.7 MB",
      "uploadDate": "2023-04-26T14:45:00.000Z",
      "encrypted": true
    }
  
  
]


export default function Home({address}) {
  return (
    <Layout>
      <main className='flex flex-col gap-12'>

          <Stats address={address}/>

          <CardTable data={data} address={address}/>


      </main>
      

    </Layout>
  )
}



export const getServerSideProps = async context => {
  const session = await getSession(context);
  const token = await getToken({ req: context.req });
  
  const address = token?.sub ?? null;
  // If you have a value for "address" here, your
  // server knows the user is authenticated.

  // You can then pass any data you want
  // to the page component here.
  return {
    props: {
      address,
      session,
    },
  };
};