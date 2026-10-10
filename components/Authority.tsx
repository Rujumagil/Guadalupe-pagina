import { homeContent } from "@/content/home";

export function Authority() {
  return (
    <section className="authority" aria-label="Trayectoria resumida" id="trayectoria">
      <div className="shell authority-grid">
        {homeContent.authority.map((item) => {
          const content = <><strong>{item.value}</strong><span>{item.label}</span></>;
          return "href" in item && item.href ? (
            <a className="authority-item authority-item-link" href={item.href} key={item.value}>{content}</a>
          ) : (
            <div className="authority-item" key={item.value}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}
