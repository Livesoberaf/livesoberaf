export default function HelpPage() {
  return (
    <main className="min-h-screen bg-black px-10 py-16 text-white">
      <section className="mx-auto max-w-6xl">
        <a
          href="/home"
          className="mb-10 inline-block text-sm uppercase tracking-[0.3em] text-white/50 transition hover:text-white"
        >
          BACK
        </a>

        <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">
          HELP
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-[0.2em] md:text-7xl">
          GET HELP NOW
        </h1>

        <p className="mt-8 max-w-3xl text-xl leading-8 text-white/75">
          If today feels difficult, support is available. If you are in immediate
          danger or feel unable to keep yourself safe, call 999 now.
        </p>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-red-400/20 bg-red-400/10 p-8">
            <h2 className="text-3xl font-semibold tracking-[0.08em]">
              URGENT SUPPORT
            </h2>

            <div className="mt-6 space-y-6 text-lg leading-8 text-white/80">
              <div>
                <p className="font-semibold text-white">EMERGENCY</p>
                <p>Call 999 if you or someone else is in immediate danger.</p>
              </div>

              <div>
                <p className="font-semibold text-white">NHS 111</p>
                <p>Call 111 for urgent medical or mental health help when it is not a 999 emergency.</p>
              </div>

              <div>
                <p className="font-semibold text-white">SAMARITANS</p>
                <p>Call 116 123 free, 24/7.</p>
                <a href="tel:116123" className="text-white underline">
                  116 123
                </a>
              </div>

              <div>
                <p className="font-semibold text-white">SHOUT</p>
                <p>Text SHOUT to 85258 for immediate text support.</p>
                <a href="sms:85258&body=SHOUT" className="text-white underline">
                  TEXT 85258
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <h2 className="text-3xl font-semibold tracking-[0.08em]">
              DRUG SUPPORT
            </h2>

            <div className="mt-6 space-y-6 text-lg leading-8 text-white/80">
              <div>
                <p className="font-semibold text-white">FRANK</p>
                <p>Confidential drug advice and information.</p>
                <a href="tel:03001236600" className="text-white underline">
                  0300 123 6600
                </a>
              </div>

              <div>
                <p className="font-semibold text-white">NARCOTICS ANONYMOUS</p>
                <p>Support for anyone who wants to stop using drugs.</p>
                <a href="tel:03009991212" className="text-white underline">
                  0300 999 1212
                </a>
              </div>

              <div>
                <p className="font-semibold text-white">CHANGE GROW LIVE</p>
                <p>Find local drug and alcohol support services.</p>
                <a
                  href="https://www.changegrowlive.org/local-support/find-different-services"
                  className="text-white underline"
                >
                  FIND LOCAL SUPPORT
                </a>
              </div>

              <div>
                <p className="font-semibold text-white">WE ARE WITH YOU</p>
                <p>Support for drug, alcohol and mental health problems.</p>
                <a
                  href="https://www.wearewithyou.org.uk"
                  className="text-white underline"
                >
                  WEAREWITHYOU.ORG.UK
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <h2 className="text-3xl font-semibold tracking-[0.08em]">
              ALCOHOL SUPPORT
            </h2>

            <div className="mt-6 space-y-6 text-lg leading-8 text-white/80">
              <div>
                <p className="font-semibold text-white">DRINKAWARE</p>
                <p>Support and advice for alcohol concerns.</p>
                <a href="tel:03001231110" className="text-white underline">
                  0300 123 1110
                </a>
              </div>

              <div>
                <p className="font-semibold text-white">ALCOHOLICS ANONYMOUS</p>
                <p>Support for anyone with alcohol problems.</p>
                <a href="tel:08009177650" className="text-white underline">
                  0800 9177 650
                </a>
              </div>

              <div>
                <p className="font-semibold text-white">TURNING POINT</p>
                <p>Drug, alcohol and mental health support services.</p>
                <a
                  href="https://www.turning-point.co.uk"
                  className="text-white underline"
                >
                  TURNING-POINT.CO.UK
                </a>
              </div>

              <div>
                <p className="font-semibold text-white">WE ARE WITH YOU</p>
                <p>Alcohol, drug and mental health support.</p>
                <a
                  href="https://www.wearewithyou.org.uk"
                  className="text-white underline"
                >
                  WEAREWITHYOU.ORG.UK
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <h2 className="text-3xl font-semibold tracking-[0.08em]">
              MENTAL HEALTH & RECOVERY
            </h2>

            <div className="mt-6 space-y-6 text-lg leading-8 text-white/80">
              <div>
                <p className="font-semibold text-white">MIND</p>
                <p>Information and support for mental health and addiction.</p>
                <a
                  href="https://www.mind.org.uk/information-support/types-of-mental-health-problems/recreational-drugs-alcohol-and-addiction/drug-and-alcohol-addiction-useful-contacts/"
                  className="text-white underline"
                >
                  MIND SUPPORT
                </a>
              </div>

              <div>
                <p className="font-semibold text-white">NHS ADDICTION SUPPORT</p>
                <p>Find NHS advice and treatment routes for addiction support.</p>
                <a
                  href="https://www.nhs.uk/live-well/addiction-support/"
                  className="text-white underline"
                >
                  NHS ADDICTION SUPPORT
                </a>
              </div>

              <div>
                <p className="font-semibold text-white">DAN 24/7 (WALES)</p>
                <p>Drug and alcohol helpline for Wales.</p>
                <a href="tel:08088082234" className="text-white underline">
                  0808 808 2234
                </a>
              </div>

              <div>
                <p className="font-semibold text-white">TALK TO YOUR GP</p>
                <p>Your GP can refer you into local drug, alcohol or mental health treatment.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-semibold tracking-[0.08em]">
            IF YOU CANNOT TALK RIGHT NOW
          </h2>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
            If you do not feel able to make a call, text support is available through
            SHOUT. You can also use support websites above to find local services,
            online information, and next steps.
          </p>
        </div>
      </section>
    </main>
  );
}