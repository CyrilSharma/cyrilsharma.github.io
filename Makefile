# Directories
ARTICLE_SRC_DIR := content/articles
TYP_OUT_DIR := html
META_JSON := meta.json
META_SCRIPT := scripts/gen_meta.py

TEMPLATE_DIR := typ/templates
TEMPLATE_SRC := $(wildcard $(TEMPLATE_DIR)/*.typ)
TEMPLATE_CFG := $(wildcard $(TEMPLATE_DIR)/*.toml)

# Publishable sources. Plain files in content/articles are draft scratch files
# until `just publish` moves them into a section folder.
BLOG_SRC  := $(wildcard $(ARTICLE_SRC_DIR)/blog/*.typ)
NOTES_SRC := $(wildcard $(ARTICLE_SRC_DIR)/notes/*.typ)
ALL_SRC   := $(BLOG_SRC) $(NOTES_SRC)
ALL_SRC_ESC := $(foreach f,$(ALL_SRC),'$(f)')

# Outputs (one html/<section>/<slug>/index.html per source)
TYP_HTML := \
  $(patsubst $(ARTICLE_SRC_DIR)/blog/%.typ,  $(TYP_OUT_DIR)/blog/%/index.html, $(BLOG_SRC)) \
  $(patsubst $(ARTICLE_SRC_DIR)/notes/%.typ, $(TYP_OUT_DIR)/notes/%/index.html, $(NOTES_SRC))

.PHONY: all typst clean meta

all: typst meta

typst: $(TYP_HTML)

meta: $(META_JSON)

# Generate one explicit rule per source file.
define TYP_RULE_ARTICLE
$(patsubst $(ARTICLE_SRC_DIR)/%.typ,$(TYP_OUT_DIR)/%/index.html,$(1)): $(1) $(TEMPLATE_SRC) $(TEMPLATE_CFG)
	@mkdir -p $$(dir $$@)
	typst compile '$(1)' '$$@' --format html --features html --root .
endef
$(foreach src,$(ALL_SRC),$(eval $(call TYP_RULE_ARTICLE,$(src))))

$(META_JSON): $(ALL_SRC) $(META_SCRIPT)
	@echo "Generating $@"
	uv run $(META_SCRIPT) --out $@ --root . --features html $(ALL_SRC_ESC)

# Optional: clean generated HTML
clean:
	@rm -rf $(TYP_OUT_DIR)
