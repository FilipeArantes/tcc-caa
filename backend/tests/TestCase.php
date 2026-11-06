<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use RuntimeException;

abstract class TestCase extends BaseTestCase
{
    public function createApplication()
    {
        $app = parent::createApplication();
        $config = $app['config'];

        if ($config->get('database.default') !== 'sqlite' || $config->get('database.connections.sqlite.database') !== ':memory:') {
            throw new RuntimeException('Os testes só rodam no SQLite em memória, para não apagar o banco de desenvolvimento.');
        }

        return $app;
    }
}
