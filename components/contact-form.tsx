import { Icon } from "@/components/icons";
import { siteConfig } from "@/content/site";

const topics = [
  "Отдел продаж",
  "Партнерские программы",
  "Семинары и мероприятия",
  "Маркетплейсы",
  "Пресс-запрос",
];

export function ContactForm() {
  return (
    <form
      action={`mailto:${siteConfig.email}`}
      className="grid gap-4 rounded-md border border-stone-200 bg-white p-5 shadow-sm"
      encType="text/plain"
      method="post"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="form-field">
          <span>Имя</span>
          <input name="name" required type="text" />
        </label>
        <label className="form-field">
          <span>Email</span>
          <input name="email" required type="email" />
        </label>
      </div>
      <label className="form-field">
        <span>Тема</span>
        <select name="topic" required>
          {topics.map((topic) => (
            <option key={topic}>{topic}</option>
          ))}
        </select>
      </label>
      <label className="form-field">
        <span>Сообщение</span>
        <textarea maxLength={1000} name="message" required rows={5} />
      </label>
      <button className="primary-link justify-center" type="submit">
        <Icon className="h-4 w-4" name="mail" />
        <span>Отправить запрос</span>
      </button>
    </form>
  );
}

