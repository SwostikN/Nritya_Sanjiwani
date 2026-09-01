import { SITE, FOOTER_NAV } from "@/lib/content";

export default function Footer() {
  const contact = [SITE.email, SITE.phone].filter(Boolean);
  return (
    <footer className="ft">
      <div className="wrap">
        <div className="ft__grid">
          <div>
            <div className="ft__b">Nritya Sanjiwani</div>
            <div className="ft__ne">नृत्य संजीवनी</div>
            <p>Healing Through Kathak<br />Kathmandu, Nepal</p>
          </div>
          <div>
            <h4>Navigate</h4>
            <div className="ft__l" id="ftNav">
              {FOOTER_NAV.map(([label, key]) => (
                <span key={key} data-go={key}>{label}</span>
              ))}
            </div>
          </div>
          <div>
            <h4>Follow</h4>
            <div className="ft__l" id="ftSocial">
              {Object.entries(SITE.social).map(([name, url]) => (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer">{name}</a>
              ))}
            </div>
            <h4 style={{ marginTop: "2rem" }}>Contact</h4>
            <p id="ftContact">
              {contact.length
                ? contact.map((c, i) => <span key={i}>{i > 0 ? <br /> : null}{c}</span>)
                : "Contact details coming soon."}
            </p>
          </div>
          <div>
            <h4>Please note</h4>
            <p>
              Nritya Sanjiwani is an arts-based emotional well-being initiative and does not replace
              professional mental-health treatment or clinical therapy. Professional counsellors are
              involved to support appropriate emotional well-being and guided reflection.
            </p>
            <p style={{ marginTop: "1em" }} id="ftCrisis">
              {SITE.crisis
                ? `If you need immediate mental-health support, please contact ${SITE.crisis}.`
                : ""}
            </p>
          </div>
        </div>
        <div className="ft__bot">
          <span>© {new Date().getFullYear()} Nritya Sanjiwani. All rights reserved.</span>
          <span>Photography: Wikimedia Commons contributors (CC BY-SA 4.0) — placeholders pending the program&rsquo;s own documentation.</span>
        </div>
      </div>
    </footer>
  );
}
