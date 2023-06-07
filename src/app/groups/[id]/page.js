
"use client"
import { useParams } from 'next/navigation';


export default function GroupDetailPage() {
    const params = useParams();
    return (
        <div>
            {params.id}
        </div>
    )
}
