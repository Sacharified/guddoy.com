import Card from "components/card";

export default ({ sys, fields }) => {
    return (
        <Card
            title={fields.title}
            date={sys.createdAt}
            image={fields.heroImage.fields && fields.heroImage.fields.file.url}
            link={{
                href: `/post?id=${sys.id}`,
                as: `/post/${fields.slug}`
            }}
        />
    );
}