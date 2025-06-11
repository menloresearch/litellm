from ...openai.chat.gpt_transformation import OpenAIGPTConfig


class Qwen3NoThinkConfig(OpenAIGPTConfig):
    def _get_openai_compatible_provider_info(
        self, api_base: str | None, api_key: str | None
    ) -> tuple[str | None, str | None]:
        # OpenAI client requires api_key
        dynamic_api_key = api_key or " "
        return api_base, dynamic_api_key

    def map_openai_params(
        self,
        non_default_params: dict,
        optional_params: dict,
        model: str,
        drop_params: bool,
    ) -> dict:
        # https://qwen.readthedocs.io/en/latest/deployment/vllm.html#thinking-non-thinking-modes
        if "extra_body" not in optional_params:
            optional_params["extra_body"] = dict()
        if "chat_template_kwargs" not in optional_params["extra_body"]:
            optional_params["extra_body"]["chat_template_kwargs"] = dict()
        optional_params["extra_body"]["chat_template_kwargs"]["enable_thinking"] = False

        return super().map_openai_params(
            non_default_params, optional_params, model, drop_params
        )
