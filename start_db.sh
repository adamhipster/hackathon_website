#!/usr/bin/env bash

#see: http://exponential.io/blog/2015/02/21/install-postgresql-on-mac-os-x-via-brew/
postgres -D /usr/local/var/postgres

#in psql
#create database hackathonsapp;
#\connect DBNAME

#raw postgres
#clear all values in db
#TRUNCATE TABLE hackathons CASCADE;