import { Helmet } from "react-helmet-async";

const Schema = ({ schema }) => {
    if (!schema) return null;

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
};

export default Schema;
