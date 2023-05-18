import Layout from '../Layout'

export default function index() {
  return (
    <Layout>
        <div className="container mx-auto px-4 py-8">
            <h1>Onboarding</h1>
            
            <ul>
                <li>1. Create a new account</li>
                <li>2. Connect your wallet</li>
                <li>3. Connect to lighthouse</li>
                <li>4. Do something else</li>
                <li>5. Create a new API connection</li>
            </ul>
        </div>
    </Layout>
  )
}
