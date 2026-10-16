-- Audit V2 — recette prod du 16/10/2026 : FAQ des cas d'usage Hôtel (229) et Immobilier (221, 222, 224, 225).
-- - 229 : réponse collée dans la question + « [préciser qui assure] » (FR et EN)
-- - 222 : « [Préciser la durée minimale.] » en fin de réponse FR
-- - 221, 222, 224, 225 : traductions EN copiées depuis la page Hôtel
-- Requêtes indépendantes, à lancer une par une (auto-commit). Le landing lit d'abord landing."Translation"
-- (entityType 'DetailedFaqPageItem'), puis la valeur de base landing."DetailedFaqPageItem".
-- Chaque requête vérifie le texte FR actuel : relancée, elle ne fait rien (0 ligne).
-- Valeurs d'origine (aperçu du 16/10) : conservées dans l'historique de conversation / rapport final.

-- Q1. Hôtel 229 — valeur de base                                            → attendu : UPDATE 1
UPDATE landing."DetailedFaqPageItem"
SET question = 'Comment financer le projet ?',
    answer   = 'Par achat ou par leasing, avec des loyers déductibles en charges. Les œuvres sont livrées, accrochées et assurées.'
WHERE id = 229 AND question LIKE '%[préciser qui assure]%';

-- Q2. Hôtel 229 — traduction FR (question + réponse)                       → attendu : UPDATE 2
UPDATE landing."Translation"
SET value = CASE field
  WHEN 'question' THEN 'Comment financer le projet ?'
  ELSE 'Par achat ou par leasing, avec des loyers déductibles en charges. Les œuvres sont livrées, accrochées et assurées.' END
WHERE "entityType" = 'DetailedFaqPageItem' AND "entityId" = 229 AND field IN ('question', 'answer')
  AND "languageId" = (SELECT id FROM landing."Language" WHERE code = 'fr')
  AND value NOT IN ('Comment financer le projet ?', 'Par achat ou par leasing, avec des loyers déductibles en charges. Les œuvres sont livrées, accrochées et assurées.');

-- Q3. Hôtel 229 — traduction EN (question + réponse)                       → attendu : UPDATE 2
UPDATE landing."Translation"
SET value = CASE field
  WHEN 'question' THEN 'How can the project be financed?'
  ELSE 'Through purchase or leasing, with rent deductible as a business expense. The artworks are delivered, hung and insured.' END
WHERE "entityType" = 'DetailedFaqPageItem' AND "entityId" = 229 AND field IN ('question', 'answer')
  AND "languageId" = (SELECT id FROM landing."Language" WHERE code = 'en')
  AND value NOT IN ('How can the project be financed?', 'Through purchase or leasing, with rent deductible as a business expense. The artworks are delivered, hung and insured.');

-- Q4. Immobilier 222 — valeur de base, réponse sans le crochet             → attendu : UPDATE 1
UPDATE landing."DetailedFaqPageItem"
SET answer = 'Les deux sont possibles : location pour la durée de commercialisation d''un programme, ou achat pour les parties communes.'
WHERE id = 222 AND answer LIKE '%[Préciser la durée minimale.]%';

-- Q5. Immobilier 222 — traduction FR de la réponse                         → attendu : UPDATE 1
UPDATE landing."Translation"
SET value = 'Les deux sont possibles : location pour la durée de commercialisation d''un programme, ou achat pour les parties communes.'
WHERE "entityType" = 'DetailedFaqPageItem' AND "entityId" = 222 AND field = 'answer'
  AND "languageId" = (SELECT id FROM landing."Language" WHERE code = 'fr')
  AND value LIKE '%[Préciser la durée minimale.]%';

-- Q6. Immobilier — traductions EN des 4 questions (221, 222, 224, 225)     → attendu : UPDATE 4
UPDATE landing."Translation" t
SET value = v.en
FROM (VALUES
  (221, 'What do you offer property developers and interior designers?'),
  (222, 'Are the artworks leased or sold?'),
  (224, 'Can buyers purchase the artworks on display?'),
  (225, 'Do you work with emerging artists?')
) AS v(id, en)
WHERE t."entityType" = 'DetailedFaqPageItem' AND t."entityId" = v.id AND t.field = 'question'
  AND t."languageId" = (SELECT id FROM landing."Language" WHERE code = 'en')
  AND t.value <> v.en;

-- Q7. Immobilier — traductions EN des 4 réponses (221, 222, 224, 225)      → attendu : UPDATE 4
UPDATE landing."Translation" t
SET value = v.en
FROM (VALUES
  (221, 'The selection and hanging of original artworks for show apartments, lobbies and common areas of residential developments.'),
  (222, 'Both are possible: leasing for the marketing period of a development, or purchase for the common areas.'),
  (224, 'Yes, on preferential terms, directly from InRealArt.'),
  (225, 'Yes. They make it possible to build a coherent selection on a controlled budget, and to tell a local story around the development.')
) AS v(id, en)
WHERE t."entityType" = 'DetailedFaqPageItem' AND t."entityId" = v.id AND t.field = 'answer'
  AND t."languageId" = (SELECT id FROM landing."Language" WHERE code = 'en')
  AND t.value <> v.en;

-- Q8. Contrôle final : 20 lignes (5 éléments × FR/EN × question/réponse), cohérentes, aucune avec un crochet
SELECT t."entityId", l.code, t.field, t.value
FROM landing."Translation" t JOIN landing."Language" l ON l.id = t."languageId"
WHERE t."entityType" = 'DetailedFaqPageItem' AND t."entityId" IN (221, 222, 224, 225, 229)
ORDER BY t."entityId", l.code, t.field;
