import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Console from '../components/Console/index';
import SEO from "../components/seo"

const IndexPage = () => {
  const themeVars = {
		app: {backgroundColor: '#0000'},
		terminal: {boxShadow: '10px 10px 42px -20px rgba(191,191,191,1)'},
		window: {backgroundColor: '#ececec', color: '#F4F4F4'},
		field: {backgroundColor: '#000', color: '#F4F4F4', fontWeight: 'normal'},
		cursor: {animation : '1.02s blink-dark step-end infinite'}
	}
  return(
  <Layout>
    <SEO title="Home" />
    <h1>Hi people</h1>
      <Console theme={themeVars} />
    <Link to="/using-typescript/">Go to "Using TypeScript"</Link>
  </Layout>
)}
//gatsby new gatsby-bulma-quickstart https://github.com/amandeepmittal/gatsby-bulma-quickstart

export default IndexPage
