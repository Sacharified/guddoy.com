import React from "react";
import { Provider, inject } from "mobx-react"
import App from "next/app";
import Head from "next/head";
import Link from "next/link";
import { fetchContent, serviceFactory, createStoreFromJson } from "api/services/content";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import { Footer } from "components/layout";
import IconButton from "components/iconbutton";
import Typography from "@material-ui/core/Typography";
import GithubIcon from "static/img/github-circle.svg";
import HomeIcon from "material-design-icons/action/svg/production/ic_home_24px.svg";
import "isomorphic-unfetch";

@inject("store")
class Layout extends React.Component {
	render() {
		const { children, store } = this.props;
		return (
			<>
				<Head>
					<title>Sacha Guddoy</title>
					<meta
                        name="viewport"
                        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
                    />
				</Head>
				<AppBar position="fixed" color="default">
					<Toolbar>
						<Link href="/">
							<a><IconButton title="home" icon={HomeIcon} /></a>
						</Link>
						<Link href="https://github.com/Sacharified/guddoy.dev">
							<a rel="noopener" target="_blank"><IconButton title="github" icon={GithubIcon} /></a>
						</Link>
						<Typography variant="h6" align="right" style={{ marginLeft: "auto" }}>Sacha Guddoy</Typography>
					</Toolbar>
				</AppBar>
				<div className="layout" style={{ marginTop: "100px" }}>
					{children}
				</div>
				<Footer links={store.footerNavLinkList.fields.links} />
			</>
		);
	}
}

class MyApp extends App {
	static async getInitialProps({ Component, ctx }) {
		const service = await serviceFactory();
		const data = await fetchContent(service);
		let pageProps = {}
		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx)
		}
		return {
			data,
			pageProps
		};
	}

	constructor(props) {
		super(props);
		this.store = createStoreFromJson(props.data.items);
	}

	render() {
		const { Component, router, pageProps } = this.props;
		return (
			<>
				<Head>
					<title>Sacha Guddoy</title>
				</Head>
				<Provider store={this.store}>
					<Layout>
						<CssBaseline />
						<Component query={router.query} {...pageProps} />
					</Layout>
				</Provider>
			</>
		);
	}
}

export default MyApp;
