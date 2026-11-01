-- Public prices (INR) shown on the course page and charged at checkout.
UPDATE "Course" SET "price" = 24999, "priceOriginal" = 36000 WHERE "slug" = 'data-analyst-with-gen-ai';
UPDATE "Course" SET "price" = 49999, "priceOriginal" = 82999 WHERE "slug" = 'data-science-ml-gen-ai';
