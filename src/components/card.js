import { Card, CardContent, CardHeader, CardMedia } from "@material-ui/core";
import TimeStamp from "components/timestamp";
import Link from "next/link";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => {
	return ({
		media: {
			height: 0,
			paddingTop: "56.25%", // 16:9
		},
		anchor: {
			color: theme.palette.text.primary,
			textDecoration: "none",
			"&:hover": {
				textDecoration: "underline",
			}
		}
	});
});

export default ({ title, date, image, link }) => {
	const classes = useStyles();
	console.log(classes);
	return (
		<Card>
			<Link {...link} >
				<a className={classes.anchor}>
					{image && <CardMedia image={image} className={classes.media} />}
					<CardHeader title={title} />
				</a>
			</Link>
			<CardContent>
				<TimeStamp date={date} />
			</CardContent>
		</Card>
	);
}