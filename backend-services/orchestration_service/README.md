## Folder structure
orchestration_service/
│
├── app/
│   ├── main.py
│   ├── config.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── order_router.py
│   │   └── ...
│   ├── services/
│   │   ├── __init__.py
│   │   ├── saga_orchestrator.py
│   │   ├── rabbitmq_connection.py
│   │   ├── message_publisher.py
│   │   ├── event_consumer.py
│   │   └── ...
│   ├── models/
│   │   ├── __init__.py
│   │   ├── order.py
│   │   ├── saga_state.py
│   │   └── ...
│   └── events/
│       ├── __init__.py
│       ├── commands.py
│       ├── events.py
│       └── ...
│
├── tests/
│   ├── __init__.py
│   ├── test_order_flow.py
│   └── ...
│
├── requirements.txt
├── Dockerfile
└── README.md
