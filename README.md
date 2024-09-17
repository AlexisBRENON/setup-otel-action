# setup-otel

This action install an OpenTelemetry collector distribution, adding it to the
PATH

## Basic usage

See [action.yml](action.yml)

### Validate your collector configuration

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: AlexisBRENON/setup-otel-action@v1.0.0
    with:
      otel-version: '0.93.0'
      otel-distribution: 'otelcol-contrib'
  - run: otelcol-contrib validate --config ./otel-config.yaml
```

The `otel-distribution` input is optional and will fallback on
`otelcol-contrib`.

## License

The scripts and documentation in this project are released under the
[MIT License](LICENSE).

## Contributions

Contributions are welcome!
