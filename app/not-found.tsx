export default function NotFound() {
  return (
    <div className="page is-on" data-page="404">
      <section className="sec">
        <div className="wrap narrow" style={{ textAlign: "center" }}>
          <span className="eyebrow deva" style={{ justifyContent: "center" }}>बाटो हरायो</span>
          <h1 className="h1" style={{ margin: ".5em 0" }}>This step is missing.</h1>
          <p className="lede">The page you were looking for isn&rsquo;t here. The dance continues elsewhere.</p>
          <button className="btn" style={{ marginTop: "2rem" }} data-go="home">Return Home</button>
        </div>
      </section>
    </div>
  );
}
