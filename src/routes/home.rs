use crate::components::{controls::Controls, player::Player};
use leptos::*;
use leptos_image::Image;
use leptos_router::*;

#[component]
fn Sponsor(href: String, title: String, children: Children) -> impl IntoView {
  view! {
    <div class="p-1 mb-2">
      <a href=href title=title target="_blank">
        {children()}
      </a>
    </div>
  }
}

#[component]
pub(crate) fn HomePage() -> impl IntoView {
  view! {
    <Player/>
    <div class="flex justify-evenly mt-10 mb-10">
      <div class="max-w-sm">
        <div style="width: 384; height: 329">
          <Image
            src="/logodinxperfm.png"
            alt="De markt van Dinxperlo"
            width=384
            height=329
            quality=100
            lazy=false
            priority=true
            class="w-[384] h-auto"
          />
        </div>
        <p class="text-center mt-4">"Het swingende geluid van Dinxperlo!"</p>
      </div>
    </div>
    <nav class="flex justify-evenly bg-gray-100">
      <ul class="flex flex-wrap list-none my-1">
        <li>
          <Controls
            title="Luister naar Dinxper FM - Het swingende geluid van Dinxperlo!".into()
            label="Luister live!".into()
            src="https://stream.dinxperfm.nl/1".into()
          />
        </li>
        <li>
          <A class="inline-block mt-3 px-4 no-underline text-blue-700" href="/uzg">
            "Uitzending gemist?"
          </A>
        </li>
      </ul>
    </nav>
    <div class="mt-10 flex justify-center">
      <div style="width: 1085; height: 656">
        <Image
          src="/programmering/WeekprogrammaDFM-20230304.jpg"
          alt="Programmering vanaf 4 maart 2023 van Dinxperlo FM "
          width=1085
          height=656
          quality=100
          lazy=false
          priority=true
        />
      </div>
    </div>
    <div class="text-center">
      <a target="blank" class="text-blue-400" href="/programmering/WeekprogrammaDFM-20230304.jpg">
        "In nieuwe pagina openen"
      </a>
    </div>
    <div class="mt-10 text-center">
      <h2 class="text-2xl">"Dinxper FM wordt mede mogelijk gemaakt door"</h2>
      <div class="flex flex-row flex-wrap justify-evenly">
        <Sponsor title="De markt van Dinxperlo".into() href="https://www.facebook.com/markt.dinxperlo/".into()>
          <Image src="/sponsors/makt.jpg" alt="De markt van Dinxperlo" width=250 height=250 quality=100/>
        </Sponsor>
        <Sponsor title="Naaiatelier Monique Harmsen".into() href="http://www.naaiateliermoniqueharmsen.nl/".into()>
          <Image src="/sponsors/logo13.jpg" alt="Naaiatelier Monique Harmsen" width=250 height=250 quality=100/>

        </Sponsor>
        <Sponsor title="Podesta event supplies".into() href="https://podesta.nl/".into()>
          <Image src="/sponsors/logo15.jpg" alt="Podesta event supplies" width=250 height=250 quality=100/>

        </Sponsor>
        <Sponsor
          title="Adviesbureau Roenhorst Dinxperlo".into()
          href="https://www.facebook.com/Adviesbureau-Roenhorst-Dinxperlo-234893600009274/".into()
        >
          <Image src="/sponsors/logo16.jpg" alt="Adviesbureau Roenhorst Dinxperlo" width=250 height=250 quality=100/>

        </Sponsor>
        <Sponsor
          title="Landwinkel Smits Groenten & Fruit | Smits Groentekwekerij B.V. | Smits Groenten en Fruit".into()
          href="http://www.groentekwekerij-smits.nl/".into()
        >
          <Image
            src="/sponsors/logo18.jpg"
            alt="Landwinkel Smits Groenten & Fruit | Smits Groentekwekerij B.V. | Smits Groenten en Fruit"
            width=250
            height=250
            quality=100
          />
        </Sponsor>
        <Sponsor
          title="Te Grotenhuis - Afvalstraat - Zand & grind verkoop - Dinxperlo".into()
          href="http://www.tegrotenhuisdinxperlo.nl/".into()
        >
          <Image
            src="/sponsors/logo19.jpg"
            alt="Te Grotenhuis - Afvalstraat - Zand & grind verkoop - Dinxperlo"
            width=250
            height=250
            quality=100
          />
        </Sponsor>
        <Sponsor title="Tiggelovend-Kok B.V.".into() href="https://www.tiggelovend-kok.nl/".into()>
          <Image src="/sponsors/logo22.jpg" alt="Tiggelovend-Kok B.V." width=250 height=250 quality=100/>
        </Sponsor>
        <Sponsor
          title="VVNF: Vereniging Viering Nationale Feest- en Gedenkdagen Dinxperlo".into()
          href="http://www.vvnf.nl/".into()
        >
          <Image
            src="/sponsors/logo23.jpg"
            alt="VVNF: Vereniging Viering Nationale Feest- en Gedenkdagen Dinxperlo"
            width=250
            height=250
            quality=100
          />
        </Sponsor>
        <Sponsor
          title="Jumbo Dinxperlo Leussink".into()
          href="https://www.jumbo.com/content/jumbo-dinxperlo-heelweg/".into()
        >
          <Image src="/sponsors/jumbo.jpg" alt="Jumbo Dinxperlo Leussink" width=250 height=250 quality=100/>
        </Sponsor>
        <Sponsor title="Old Dutch Dinxperlo".into() href="https://www.olddutchdinxperlo.nl/".into()>
          <Image src="/sponsors/olddutch.jpg" alt="Old Dutch Dinxperlo" width=250 height=250 quality=100/>
        </Sponsor>
        <Sponsor title="MA-Shops".into() href="https://www.ma-shops.nl/?ref=dinxperfm".into()>
          <Image src="/sponsors/mashops.jpg" alt="MA-Shops" width=250 height=250 quality=100/>
        </Sponsor>
        <Sponsor
          title="Expert Dinxperlo".into()
          href="https://www.expert.nl/winkels/dinxperlo?gclid=EAIaIQobChMI1Jutxdrh4AIVzLztCh02DgFoEAAYASAAEgJwevD_BwE"
              .into()
        >
          <Image src="/sponsors/expert.jpg" alt="Expert Dinxperlo" width=250 height=250 quality=100/>
        </Sponsor>
        <Sponsor title="Alswin".into() href="https://www.dinxperlo.nl".into()>
          <Image src="/sponsors/alswingr.jpg" alt="Alswin" width=250 height=250 quality=100/>
        </Sponsor>
      </div>
    </div>
  }
}
