import Head from 'next/head';

export default (props) => {
  return (
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <title>{props.title}</title>
      <link rel="stylesheet" href="../../static/normalize.css" />
      <link rel="stylesheet" href="../../static/style.css" />
      <link href="https://fonts.googleapis.com/css?family=Poppins:400,700" rel="stylesheet" />
      <style>{`
      `}
      </style>
    </Head>
  );
}
