import { Headline } from "@/components/content/Headline";
import { Picture } from "@/components/content/Picture";
import { SelfCheck } from "@/components/quiz/SelfCheck";
import { resolveLink } from "@/lib/tokens";
import type { BlockProps, QuizBlockData, QuizSources } from "../types";
import { Rail, Surface } from "./parts";

/** Keeps the phone number on one line when the label wraps. */
function NoBreakPhone({ text, phone }: { text: string; phone: string }) {
  const at = text.indexOf(phone);

  return at < 0 ? (
    <>{text}</>
  ) : (
    <>
      {text.slice(0, at)}
      <span className="whitespace-nowrap">{phone}</span>
      {text.slice(at + phone.length)}
    </>
  );
}

/**
 * Quiz "Assessment" (Figma 34:428). The intro is server-rendered; the quiz
 * card is a client island that receives the published quiz with every
 * {phone} / tel:clinic token already resolved.
 */
export function QuizBlock({ data, sources, number, anchor, ctx }: BlockProps<QuizBlockData, QuizSources>) {
  const quiz = sources.quiz;
  const founder = sources.founder?.[0];
  const speak = resolveLink(data.speak_link, ctx.settings);
  const headingId = anchor ? `${anchor}-title` : "self-check-title";
  const Heading = ctx.isFirst ? "h1" : "h2";

  return (
    <div className="pt-3 md:pt-4 lg:pt-6">
      <Surface id={anchor ?? undefined} labelledBy={headingId} innerClassName="bg-sky-soft !py-10 md:!py-14 lg:!py-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
          <div className="flex min-w-0 flex-col items-start gap-6 lg:w-[440px] lg:shrink-0">
            <Rail number={number} label={data.rail} />
            {data.headline && (
              <Headline as={Heading} id={headingId} text={data.headline} className="font-serif text-[40px] leading-[1.08] tracking-[-0.02em] md:text-display-l lg:text-[60px]" />
            )}
            {data.subheading && <p className="text-body-l text-ink-soft">{data.subheading}</p>}
            {data.items.length > 0 && (
              <ul className="flex flex-col gap-3">
                {data.items.map((item) => (
                  <li key={item} className="flex items-center gap-3.5 text-body-m">
                    <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-royal" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {data.disclaimer && <p className="text-body-s text-ink-soft">{data.disclaimer}</p>}
            {(data.speak_title || speak) && (
              <div className="flex max-w-full items-center gap-3.5 rounded-full bg-white py-2 pr-6 pl-2">
                {founder?.photo && (
                  <div className="size-14 shrink-0 overflow-hidden rounded-full bg-sky">
                    <Picture image={founder.photo} sizes="56px" className="block size-full" />
                  </div>
                )}
                <div className="flex min-w-0 flex-col">
                  {data.speak_title && <p className="text-body-s text-ink-soft">{data.speak_title}</p>}
                  {speak && (
                    <a href={speak.href} className="font-display text-[16px] leading-[1.3] font-bold text-royal underline-offset-4 hover:underline">
                      <NoBreakPhone text={speak.label} phone={ctx.settings.phone.display} />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            {quiz ? (
              <SelfCheck
                headerLabel={quiz.header_label}
                submitLabel={quiz.submit_label}
                privacyNote={quiz.privacy_note}
                resultEyebrow={quiz.result_eyebrow}
                resultDisclaimer={quiz.result_disclaimer}
                questions={quiz.questions}
                results={quiz.results.map((result) => ({
                  when: result.when,
                  is_default: result.is_default,
                  title: result.title,
                  body: result.body,
                  primary: resolveLink(result.primary, ctx.settings),
                  secondary: resolveLink(result.secondary, ctx.settings),
                }))}
              />
            ) : (
              <div className="rounded-sheet bg-white p-8 text-body-m text-ink-soft">
                The self-check is being updated. Call{" "}
                <a href={ctx.settings.phone.href} className="font-bold text-royal">
                  {ctx.settings.phone.display}
                </a>{" "}
                to talk with the team.
              </div>
            )}
          </div>
        </div>
      </Surface>
    </div>
  );
}
