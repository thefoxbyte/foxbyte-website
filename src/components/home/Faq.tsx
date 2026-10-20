import { faqs } from "@/content/home";
import { FaqList } from "@/components/page/FaqList";

export function Faq() {
  return (
    <section id="faq" className="sec">
      <div className="wrap">
        <div className="head center">
          <span className="eyebrow">FAQ</span>
          <h2 className="h2">Questions, answered</h2>
        </div>
        <FaqList items={faqs} />
      </div>
    </section>
  );
}
