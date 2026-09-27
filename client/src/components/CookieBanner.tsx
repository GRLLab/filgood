import { useEffect, useState } from "react";
import { Cookie, Settings2, X } from "lucide-react";

const CONSENT_KEY = "filgood-cookie-consent";
type Consent = "essential" | "all";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<Consent>("essential");

  useEffect(() => {
    setVisible(!window.localStorage.getItem(CONSENT_KEY));
    const review = () => { setShowDetails(false); setVisible(true); };
    window.addEventListener("filgood:review-cookies", review);
    return () => window.removeEventListener("filgood:review-cookies", review);
  }, []);

  const save = (value: Consent) => {
    window.localStorage.setItem(CONSENT_KEY, value);
    setVisible(false);
    setShowDetails(false);
  };

  if (!visible) return null;
  return (
    <aside className="cookie-banner" role="dialog" aria-label="Préférences de cookies">
      <button className="cookie-close" type="button" onClick={() => save("essential")} aria-label="Fermer et garder les cookies essentiels"><X size={17} /></button>
      <div className="cookie-reel" aria-hidden="true"><Cookie size={24} /><span /><span /><span /></div>
      <div className="cookie-copy"><p className="cookie-kicker">Le petit mot du filament</p><h2>On déroule le fil ?</h2><p>Quelques cookies essentiels font tourner le site. Les cookies de mesure, eux, restent sur leur bobine tant que vous ne les avez pas invités.</p>{showDetails && <div className="cookie-details"><label><input type="radio" checked={consent === "essential"} onChange={() => setConsent("essential")} /> Essentiels uniquement</label><label><input type="radio" checked={consent === "all"} onChange={() => setConsent("all")} /> Essentiels + mesure d’audience</label></div>}</div>
      <div className="cookie-actions">{showDetails ? <button className="cookie-button cookie-primary" type="button" onClick={() => save(consent)}>Enregistrer mon choix</button> : <><button className="cookie-button cookie-secondary" type="button" onClick={() => save("essential")}>Essentiels uniquement</button><button className="cookie-button cookie-primary" type="button" onClick={() => save("all")}>Tout accepter</button></>}<button className="cookie-preferences" type="button" onClick={() => setShowDetails((value) => !value)}><Settings2 size={14} /> {showDetails ? "Fermer les détails" : "Mes préférences"}</button></div>
    </aside>
  );
}
