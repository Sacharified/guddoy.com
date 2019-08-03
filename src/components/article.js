import { Container } from "components/layout";
import TimeStamp from "components/timestamp";
import Typography from "@material-ui/core/Typography";
import { richTextToComponent } from "utils/text";
import TagList from "components/tags";
import dynamic from "next/dynamic";

const Lqip = dynamic(() => import("lqip-react"), { ssr: false });


const HeroImage = ({
	file: {
		url,
		details: {
			image: { width, height }
		}
	},
	description,
	title
}) => {
	// const fileName = url.substr(url.lastIndexOf("/", url.lastIndexOf(".")));
	const fileName = url.split("/").pop();
	const folder = `/static/content/img/${fileName}`;

	return (
		<Container maxWidth="md">
			<Lqip
				aspectRatio={`${width}x${height}`}
				thumbnail={`${folder}/image.svg`}
				src={`${folder}/image.jpeg`}
				alt={title}
				width="100%"
			/>
			<Typography variant="caption">
				{description}
			</Typography>
		</Container>
	)
};

const Header = ({ title, subtitle, date, tags }) => (
	<>
		<Container maxWidth="md">
			<Typography variant="h2" component="h2" gutterBottom>
				{title}
			</Typography>
			<Typography variant="subtitle1" component="h5" gutterBottom>
				{subtitle}
			</Typography>
			<TimeStamp date={date} />
		</Container>
		<Container>
			<Typography variant="caption" display="inline">Tags:</Typography>
			<TagList tags={tags} />
		</Container>
	</>
);

export default ({ fields, sys }) => {
	return (
		<Container component="article" maxWidth="md">
			<Header title={fields.title} subtitle={fields.subtitle} date={sys.createdAt} tags={fields.tags} />
			{fields.heroImage.fields && <HeroImage {...fields.heroImage.fields} />}
			<Container maxWidth="md">
				<Typography variant="body1" component="div" gutterBottom>
					{richTextToComponent(fields.content)}
				</Typography>
			</Container>
		</Container>
	);
}
