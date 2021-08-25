Disclaimer z tak wygenerowanego API clienta możemy korzystać też na backendzie.

## Konsumowanie API na froncie na przykładzie Swagger/OAS i GraphQL

### Agenda

1. Wprowadzenie, skąd pomysł
1. Krótkie omówienie servera nodejs z którego serwowane jest API
1. Generowanie typów TypeScript i http client na podstawie Swagger/OAS API
1. Codegen Generator dla GraphQL
1. Przykładowe wykorzystanie w aplikacji reactowej przy użyciu biblioteki React Query, Apollo Client
1. Jak wspomóc się apkami Postman i Altair
1. Podsumowanie

2. [Fun] Swagger/OAS konwertowalny do graphql schema
GraphQLSchema
   
----

### Ad 1. Wprowadzenie, skąd pomysł

Z perspektywy frontendowca
Pod koniec ubiegłego roku jeden z naszych klientów dał nam dosyć krótki deadline na realizację projektu.
Były to mniej niecałe 2 miesiące, które ostatecznie zostały przedłużone do 3. 
Backend nie był przygotowany, w zasadzie nic nie było, a wszystkie zespoły w projekcie pracowały równolegle.
Ustalenia z klientem często się zmieniały, a co za tym idzie kontrakt pomiędzy BE a FE. 
Wiedzieliśmy, że żeby wyrobić się w terminie(gdzie kolejne iteracje trwały nawet 4 dni) będziemy potrzebować sposobu na przyspieszenie developmentu.

Z perspektywy backendowca
Nieotypowane resolvery servera Apollo GraphQL. Typy generujemy ze schemy, która jest źródłem prawdy.

#### Słowniczek

- `OAS` - Openapi Specification, kiedyś znana jako Swagger Specification
- `Swagger` - Zbiór narzędzi implementujących OAS (Parser, Editor, UI, Inspector, itd.)
- `GraphQL` - GraphQL to w zasadzie query language, specyfikacja języka do implementacji serwerów API GraphQL.
            Przykładowe implementacje: Apollo, Relay, TypeGraphQL, Nexus, Yoga, Prisma.
- `ReactJS` - biblioteka FE do budowania UI

----

### Ad. 2. Krótkie omówienie servera nodejs z którego serwowane jest API

- Sandbox https://codesandbox.io/s/tsed-swagger-graphql-092021-g9n41
- Potrzebujesz jedynie instancji bazy danych mongodb, darmową możesz założyć na https://www.mongodb.com/cloud (btw. mlab.com został przejęty przez mongodb.com)
- Server stoi na frameworku TS.ED https://tsed.io
- Server działa całkiem spoko w developmencie. W razie pytań to lojalnie informuję, że nie wykorzystywałem go nigdy produkcyjnie. Wypróbowałem go jedynie przy okazji realizacji tego warszatu.

#### process.env.MONGO_URL
W zakładce `Server Control Panel` ustawiamy zmienną środowiską `process.env.MONGO_URL`, aby wskazywała na connection string naszej bazy.
Connection string powinien wyglądać mniej więcej tak:
`mongodb+srv://<username>:<password>@<cluster-name>.<random-subdomain>.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

![Jak dodać secret](images/add-secret.png "Jak dodać secret")

#### Jak pobrać projekt
![Jak exportować](images/how-to-export.png "Jak exportować")

----

### Ad 3. Generowanie typów TypeScript i http client na podstawie Swagger/OAS API

----

### Ad 4. Codegen Generator dla GraphQL

----

### Ad 5. Przykładowe wykorzystanie w aplikacji reactowej przy użyciu biblioteki React Query, Apollo Client

----

### Ad 6. Tooling. Jak wspomóc się apkami Postman i Altair

----

### Ad. 7. Podsumowanie

...
OAS->GraphQL
Przy bardziej złożonych schemach OAS nie będziemy w stanie zmapować 1:1, 
generator z pewnością może nam pomóc w developmencie, ale nie możemy zakładać, że wykona za nas całą robotę.

todo: tutaj może dać po prostu generatorów swagger api
#### Wady i zalety, Kiedy używać generatorów?

*Pros*
- Poprawne typy
- Uderzamy do właściwych endpointów API
- Używamy prawidłowych parametrów
- Z łatwością interpretujemy response requestu
- Z łatwością jesteśmy w stanie zweryfikować zmiany, które nastąpiły w API
- Oszczędność czasu, nie musimy się martwić refactorem, naprawą błędów, niepoprawnymi typami
- Kontrakt API to źródło prawdy dla aplikacji na froncie
- Mamy świadomość, że nasz codebase, a przynajmniej codebase naszego API jest niezawodny :)

*Cons*
- Raczej dla małych teamów 
  - Konieczność przeładowania/ponownej generacji typów i clienta http przy zmianie kontraktu przez backend
- Może być uciążliwe dla dużych zespołów
  - Paczka z typami i clientem mogłaby być wystawiana zaraz obok nowej wersji backendu (integracja CI/CD)


#### Do poczytania / Linki

- https://blog.pragmatists.com/generating-a-typescript-api-client-541109422c40
- https://dev.to/wkrueger/integrating-apis-to-a-typescript-frontend-with-openapi-swagger-3521
- https://the-guild.dev/blog/whats-new-in-graphql-codegen-v2
- https://openapi-generator.tech/
- https://tsed.io/



----
- Sprawdziłem 3 biblioteki do rzutowania OAS v2 v3/Swagger 
  swagger-to-graphql swagql openapi-to-graphql
  
Najrozsadniej wyglada openapi-to-graphql, najmniej problemow, 
swagger-to-graphql dziala jedynie z v2 OAS
----

`openapi-to-graphql`



