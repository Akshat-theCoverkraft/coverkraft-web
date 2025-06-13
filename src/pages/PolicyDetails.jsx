import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_URL from "../ServiceModule/Service";

const PolicyDetails = () => {
    const { id } = useParams();
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Fetching policy with ID:", id);
        axios
            .get(`${API_URL}policyType/getById?_id=${id}`)
            .then((res) => {
                console.log("API Response:", res.data);
                if (res.data.status) {
                    setPolicy(res.data.data);
                } else {
                    console.error("Policy not found");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("API error:", err);
                setLoading(false);
            });
    }, [id]);


    if (loading) return <div style={{ padding: 50 }}>Loading...</div>;
    if (!policy) return <div style={{ padding: 50 }}>No data found</div>;

    return (
        <div className="policy-detail-page" style={{ padding: '2em' }}>
            {/* Banner */}
            <div
                style={{
                    backgroundImage: `url(${policy.icon})`,
                    height: '300px',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '20px',
                    marginBottom: '2em'
                }}
            />

            {/* Policy Name */}
            <h1 style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '1em' }}>
                {policy.policyType}
            </h1>

            {/* Description / Details */}
            <p style={{ fontSize: '1.1em', color: '#444', lineHeight: '1.6' }}>
                {policy.details || "No description available."}
            </p>
        </div>
    );
};

export default PolicyDetails;
