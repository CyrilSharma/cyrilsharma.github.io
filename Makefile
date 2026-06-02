# Directories
TYP_SRC_DIR   := content/blog
NOTES_SRC_DIR := content/notes
LOCAL_SRC_DIR := local/article
TYP_OUT_DIR := html
META_JSON := meta.json
META_SCRIPT := scripts/gen_meta.py

TEMPLATE_DIR := typ/templates
TEMPLATE_SRC := $(wildcard $(TEMPLATE_DIR)/*.typ)
TEMPLATE_CFG := $(wildcard $(TEMPLATE_DIR)/*.toml)

# Sources from all dirs
TYP_SRC   := $(wildcard $(TYP_SRC_DIR)/*.typ)
NOTES_SRC := $(wildcard $(NOTES_SRC_DIR)/*.typ)
LOCAL_SRC := $(wildcard $(LOCAL_SRC_DIR)/*.typ)
ALL_SRC   := $(TYP_SRC) $(NOTES_SRC) $(LOCAL_SRC)
ALL_SRC_ESC := $(foreach f,$(ALL_SRC),'$(f)')

# Outputs (one html/<slug>/index.html per source)
TYP_HTML := \
  $(patsubst $(TYP_SRC_DIR)/%.typ,   $(TYP_OUT_DIR)/blog/%/index.html, $(TYP_SRC)) \
  $(patsubst $(NOTES_SRC_DIR)/%.typ, $(TYP_OUT_DIR)/notes/%/index.html, $(NOTES_SRC)) \
  $(patsubst $(LOCAL_SRC_DIR)/%.typ,  $(TYP_OUT_DIR)/local/%/index.html, $(LOCAL_SRC))

.PHONY: all typst clean meta

all: typst meta

typst: $(TYP_HTML)

meta: $(META_JSON)

# Generate one explicit rule per source file so multiple source dirs work correctly.
define TYP_RULE_ARTICLE
$(TYP_OUT_DIR)/blog/$(basename $(notdir $(1)))/index.html: $(1) $(TEMPLATE_SRC) $(TEMPLATE_CFG)
	@mkdir -p $$(dir $$@)
	typst compile '$(1)' '$$@' --format html --features html --root .
endef
define TYP_RULE_NOTES
$(TYP_OUT_DIR)/notes/$(basename $(notdir $(1)))/index.html: $(1) $(TEMPLATE_SRC) $(TEMPLATE_CFG)
	@mkdir -p $$(dir $$@)
	typst compile '$(1)' '$$@' --format html --features html --root .
endef
define TYP_RULE_LOCAL
$(TYP_OUT_DIR)/local/$(basename $(notdir $(1)))/index.html: $(1) $(TEMPLATE_SRC) $(TEMPLATE_CFG)
	@mkdir -p $$(dir $$@)
	typst compile '$(1)' '$$@' --format html --features html --root .
endef
$(foreach src,$(TYP_SRC),$(eval $(call TYP_RULE_ARTICLE,$(src))))
$(foreach src,$(NOTES_SRC),$(eval $(call TYP_RULE_NOTES,$(src))))
$(foreach src,$(LOCAL_SRC),$(eval $(call TYP_RULE_LOCAL,$(src))))

$(META_JSON): $(ALL_SRC) $(META_SCRIPT)
	@echo "Generating $@"
	python3 $(META_SCRIPT) --out $@ --root . --features html $(ALL_SRC_ESC)

# Optional: clean generated HTML
clean:
	@rm -rf $(TYP_OUT_DIR)
