import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "workspace_manager"."enum_users_role" AS ENUM('admin', 'user');
  CREATE TYPE "workspace_manager"."enum_tasks_dependencies_type" AS ENUM('blocks', 'requires', 'related');
  CREATE TYPE "workspace_manager"."enum_tasks_status" AS ENUM('todo', 'in-progress', 'in-review', 'blocked', 'completed');
  CREATE TYPE "workspace_manager"."enum_tasks_priority" AS ENUM('low', 'medium', 'high', 'critical');
  CREATE TYPE "workspace_manager"."enum_workspaces_members_role" AS ENUM('admin', 'member', 'viewer');
  CREATE TYPE "workspace_manager"."enum_workspaces_icon" AS ENUM('briefcase', 'code', 'document', 'globe', 'home', 'lightning', 'people', 'project', 'star');
  CREATE TYPE "workspace_manager"."enum_workspaces_color" AS ENUM('blue', 'green', 'red', 'purple', 'orange', 'pink', 'cyan', 'yellow', 'gray');
  CREATE TYPE "workspace_manager"."enum_projects_assignees_role" AS ENUM('manager', 'developer', 'designer', 'tester', 'stakeholder');
  CREATE TYPE "workspace_manager"."enum_projects_status" AS ENUM('planning', 'in-progress', 'on-hold', 'completed', 'canceled');
  CREATE TYPE "workspace_manager"."enum_projects_priority" AS ENUM('low', 'medium', 'high', 'critical');
  CREATE TYPE "workspace_manager"."enum_features_assignees_role" AS ENUM('owner', 'developer', 'reviewer', 'tester', 'stakeholder');
  CREATE TYPE "workspace_manager"."enum_features_dependencies_type" AS ENUM('blocks', 'requires', 'related');
  CREATE TYPE "workspace_manager"."enum_features_dependencies_strength" AS ENUM('weak', 'medium', 'strong');
  CREATE TYPE "workspace_manager"."enum_features_approvals_status" AS ENUM('pending', 'approved', 'rejected');
  CREATE TYPE "workspace_manager"."enum_features_status" AS ENUM('proposed', 'approved', 'in-development', 'in-review', 'testing', 'done', 'rejected');
  CREATE TYPE "workspace_manager"."enum_features_priority" AS ENUM('low', 'medium', 'high', 'critical');
  CREATE TYPE "workspace_manager"."enum_work_items_dependencies_type" AS ENUM('blocks', 'requires', 'related');
  CREATE TYPE "workspace_manager"."enum_work_items_type" AS ENUM('task', 'bug', 'documentation', 'test', 'refactor', 'enhancement');
  CREATE TYPE "workspace_manager"."enum_work_items_status" AS ENUM('todo', 'in-progress', 'in-review', 'blocked', 'completed');
  CREATE TYPE "workspace_manager"."enum_work_items_priority" AS ENUM('low', 'medium', 'high', 'critical');
  CREATE TYPE "workspace_manager"."enum_sessions_time_entries_type" AS ENUM('work', 'break', 'meeting', 'planning', 'review');
  CREATE TYPE "workspace_manager"."enum_sessions_recovery_points_type" AS ENUM('auto', 'manual');
  CREATE TYPE "workspace_manager"."enum_sessions_status" AS ENUM('active', 'paused', 'completed', 'expired');
  CREATE TYPE "workspace_manager"."enum_recovery_points_type" AS ENUM('auto', 'manual', 'error', 'system');
  CREATE TYPE "workspace_manager"."enum_dependencies_source_type" AS ENUM('feature', 'work-item', 'task', 'project');
  CREATE TYPE "workspace_manager"."enum_dependencies_target_type" AS ENUM('feature', 'work-item', 'task', 'project');
  CREATE TYPE "workspace_manager"."enum_dependencies_type" AS ENUM('blocks', 'requires', 'enhances', 'related', 'contains', 'implements', 'tests', 'duplicates');
  CREATE TYPE "workspace_manager"."enum_dependencies_strength" AS ENUM('weak', 'medium', 'strong');
  CREATE TYPE "workspace_manager"."enum_dependencies_state" AS ENUM('active', 'resolved', 'ignored');
  CREATE TYPE "workspace_manager"."enum_workflow_definitions_stages_default_assignees_role" AS ENUM('assignee', 'reviewer', 'approver');
  CREATE TYPE "workspace_manager"."enum_workflow_definitions_stages_custom_fields_field_type" AS ENUM('text', 'number', 'date', 'checkbox', 'select');
  CREATE TYPE "workspace_manager"."enum_workflow_definitions_stages_color" AS ENUM('gray', 'blue', 'green', 'yellow', 'orange', 'red', 'purple', 'pink', 'cyan');
  CREATE TYPE "workspace_manager"."enum_workflow_definitions_transition_rules_condition" AS ENUM('always', 'require-approval', 'only-assignee', 'only-creator', 'only-admin', 'custom');
  CREATE TYPE "workspace_manager"."enum_workflow_definitions_automations_trigger_type" AS ENUM('enter', 'exit', 'time');
  CREATE TYPE "workspace_manager"."enum_workflow_definitions_automations_time_condition_unit" AS ENUM('minutes', 'hours', 'days', 'weeks');
  CREATE TYPE "workspace_manager"."enum_workflow_definitions_automations_action_type" AS ENUM('assign', 'notify', 'priority', 'comment', 'move', 'custom');
  CREATE TYPE "workspace_manager"."enum_workflow_definitions_automations_notification_recipients" AS ENUM('assignee', 'creator', 'team', 'specific');
  CREATE TYPE "workspace_manager"."enum_workflow_definitions_automations_priority_value" AS ENUM('low', 'medium', 'high', 'critical');
  CREATE TYPE "workspace_manager"."enum_ai_conversations_messages_role" AS ENUM('user', 'assistant', 'system');
  CREATE TYPE "workspace_manager"."enum_ai_conversations_model_name" AS ENUM('deepseek-coder', 'llama3', 'mistral', 'codellama', 'gemma', 'custom');
  CREATE TABLE IF NOT EXISTS "workspace_manager"."users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"role" "workspace_manager"."enum_users_role" DEFAULT 'user' NOT NULL,
  	"profile_image_id" integer,
  	"bio" varchar,
  	"is_active" boolean DEFAULT true,
  	"last_login" timestamp(3) with time zone,
  	"preferences" jsonb,
  	"github_token" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."tasks_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."tasks_dependencies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"task_id" integer NOT NULL,
  	"type" "workspace_manager"."enum_tasks_dependencies_type" DEFAULT 'blocks' NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."tasks_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."tasks_comments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"author_id" integer NOT NULL,
  	"content" jsonb NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."tasks_time_tracking" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"started_at" timestamp(3) with time zone NOT NULL,
  	"ended_at" timestamp(3) with time zone,
  	"duration" numeric,
  	"description" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."tasks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" jsonb,
  	"project_id" integer NOT NULL,
  	"status" "workspace_manager"."enum_tasks_status" DEFAULT 'todo' NOT NULL,
  	"priority" "workspace_manager"."enum_tasks_priority" DEFAULT 'medium' NOT NULL,
  	"assignee_id" integer,
  	"start_date" timestamp(3) with time zone,
  	"due_date" timestamp(3) with time zone,
  	"completed_date" timestamp(3) with time zone,
  	"estimated_hours" numeric,
  	"actual_hours" numeric,
  	"parent_task_id" integer,
  	"github_issue_owner" varchar,
  	"github_issue_repo" varchar,
  	"github_issue_issue_number" numeric,
  	"github_issue_issue_url" varchar,
  	"github_issue_last_synced_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."workspaces_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"role" "workspace_manager"."enum_workspaces_members_role" DEFAULT 'member' NOT NULL,
  	"joined_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."workspaces_github_repositories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"owner" varchar NOT NULL,
  	"url" varchar,
  	"sync_enabled" boolean DEFAULT false,
  	"last_synced_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."workspaces" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"icon" "workspace_manager"."enum_workspaces_icon" DEFAULT 'briefcase',
  	"color" "workspace_manager"."enum_workspaces_color" DEFAULT 'blue',
  	"is_public" boolean DEFAULT false,
  	"settings" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."projects_assignees" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"role" "workspace_manager"."enum_projects_assignees_role" NOT NULL,
  	"assigned_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."projects_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"workspace_id" integer NOT NULL,
  	"status" "workspace_manager"."enum_projects_status" DEFAULT 'planning' NOT NULL,
  	"priority" "workspace_manager"."enum_projects_priority" DEFAULT 'medium' NOT NULL,
  	"start_date" timestamp(3) with time zone,
  	"due_date" timestamp(3) with time zone,
  	"completed_date" timestamp(3) with time zone,
  	"github_repo_owner" varchar,
  	"github_repo_name" varchar,
  	"github_repo_url" varchar,
  	"github_repo_branch" varchar DEFAULT 'main',
  	"github_repo_last_synced_at" timestamp(3) with time zone,
  	"settings" jsonb,
  	"progress" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."features_assignees" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"role" "workspace_manager"."enum_features_assignees_role" NOT NULL,
  	"assigned_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."features_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."features_dependencies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature_id" integer NOT NULL,
  	"type" "workspace_manager"."enum_features_dependencies_type" DEFAULT 'blocks' NOT NULL,
  	"strength" "workspace_manager"."enum_features_dependencies_strength" DEFAULT 'medium' NOT NULL,
  	"notes" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."features_work_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"work_item_id" integer NOT NULL,
  	"added_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."features_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."features_comments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"author_id" integer NOT NULL,
  	"content" jsonb NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."features_status_history" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to" varchar NOT NULL,
  	"changed_by_id" integer NOT NULL,
  	"changed_at" timestamp(3) with time zone NOT NULL,
  	"reason" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."features_approvals" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"transition" varchar NOT NULL,
  	"approver_id" integer NOT NULL,
  	"status" "workspace_manager"."enum_features_approvals_status" DEFAULT 'pending' NOT NULL,
  	"requested_at" timestamp(3) with time zone NOT NULL,
  	"responded_at" timestamp(3) with time zone,
  	"comments" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."features" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" jsonb,
  	"project_id" integer NOT NULL,
  	"status" "workspace_manager"."enum_features_status" DEFAULT 'proposed' NOT NULL,
  	"priority" "workspace_manager"."enum_features_priority" DEFAULT 'medium' NOT NULL,
  	"workflow_definition_id" integer,
  	"start_date" timestamp(3) with time zone,
  	"target_date" timestamp(3) with time zone,
  	"completed_date" timestamp(3) with time zone,
  	"estimated_days" numeric,
  	"github_issue_owner" varchar,
  	"github_issue_repo" varchar,
  	"github_issue_issue_number" numeric,
  	"github_issue_issue_url" varchar,
  	"github_issue_last_synced_at" timestamp(3) with time zone,
  	"progress" numeric,
  	"metadata" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."work_items_dependencies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"work_item_id" integer NOT NULL,
  	"type" "workspace_manager"."enum_work_items_dependencies_type" DEFAULT 'blocks' NOT NULL,
  	"notes" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."work_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."work_items_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."work_items_comments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"author_id" integer NOT NULL,
  	"content" jsonb NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."work_items_time_tracking" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"started_at" timestamp(3) with time zone NOT NULL,
  	"ended_at" timestamp(3) with time zone,
  	"duration" numeric,
  	"description" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."work_items_status_history" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to" varchar NOT NULL,
  	"changed_by_id" integer NOT NULL,
  	"changed_at" timestamp(3) with time zone NOT NULL,
  	"reason" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."work_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" jsonb,
  	"feature_id" integer NOT NULL,
  	"type" "workspace_manager"."enum_work_items_type" DEFAULT 'task' NOT NULL,
  	"status" "workspace_manager"."enum_work_items_status" DEFAULT 'todo' NOT NULL,
  	"priority" "workspace_manager"."enum_work_items_priority" DEFAULT 'medium' NOT NULL,
  	"assignee_id" integer,
  	"start_date" timestamp(3) with time zone,
  	"due_date" timestamp(3) with time zone,
  	"completed_date" timestamp(3) with time zone,
  	"estimated_hours" numeric,
  	"actual_hours" numeric,
  	"github_issue_owner" varchar,
  	"github_issue_repo" varchar,
  	"github_issue_issue_number" numeric,
  	"github_issue_issue_url" varchar,
  	"github_issue_last_synced_at" timestamp(3) with time zone,
  	"metadata" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."sessions_time_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"started_at" timestamp(3) with time zone NOT NULL,
  	"ended_at" timestamp(3) with time zone,
  	"duration" numeric,
  	"type" "workspace_manager"."enum_sessions_time_entries_type" DEFAULT 'work' NOT NULL,
  	"task_id" integer,
  	"description" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."sessions_recovery_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"recovery_point_id" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"created_at" timestamp(3) with time zone NOT NULL,
  	"type" "workspace_manager"."enum_sessions_recovery_points_type" DEFAULT 'auto' NOT NULL,
  	"context" jsonb
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."sessions_devices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"window_id" varchar NOT NULL,
  	"user_agent" varchar,
  	"last_active_at" timestamp(3) with time zone,
  	"ip_address" varchar,
  	"platform" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."sessions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"session_id" varchar NOT NULL,
  	"user_id" integer NOT NULL,
  	"status" "workspace_manager"."enum_sessions_status" DEFAULT 'active' NOT NULL,
  	"workspace_id" integer,
  	"project_id" integer,
  	"task_id" integer,
  	"started_at" timestamp(3) with time zone NOT NULL,
  	"last_active_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone,
  	"total_duration" numeric,
  	"active_duration" numeric,
  	"context" jsonb,
  	"last_error_message" varchar,
  	"last_error_stack" varchar,
  	"last_error_timestamp" timestamp(3) with time zone,
  	"last_error_recovery_point_created" boolean DEFAULT false,
  	"metadata" jsonb,
  	"is_archived" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."recovery_points_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."recovery_points" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"recovery_point_id" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"user_id" integer NOT NULL,
  	"session_id" integer,
  	"workspace_id" integer,
  	"project_id" integer,
  	"feature_id" integer,
  	"type" "workspace_manager"."enum_recovery_points_type" DEFAULT 'manual' NOT NULL,
  	"state" jsonb NOT NULL,
  	"thumbnail_image_id" integer,
  	"device_info_user_agent" varchar,
  	"device_info_platform" varchar,
  	"device_info_window_id" varchar,
  	"device_info_ip_address" varchar,
  	"metadata" jsonb,
  	"is_archived" boolean DEFAULT false,
  	"expires_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."dependencies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"description" varchar,
  	"source_type" "workspace_manager"."enum_dependencies_source_type" NOT NULL,
  	"source_id" varchar NOT NULL,
  	"target_type" "workspace_manager"."enum_dependencies_target_type" NOT NULL,
  	"target_id" varchar NOT NULL,
  	"type" "workspace_manager"."enum_dependencies_type" DEFAULT 'blocks' NOT NULL,
  	"strength" "workspace_manager"."enum_dependencies_strength" DEFAULT 'medium' NOT NULL,
  	"state" "workspace_manager"."enum_dependencies_state" DEFAULT 'active' NOT NULL,
  	"workspace_id" integer NOT NULL,
  	"project_id" integer,
  	"notes" varchar,
  	"created_by_id" integer,
  	"resolved_by_id" integer,
  	"resolved_at" timestamp(3) with time zone,
  	"metadata" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."workflow_definitions_stages_default_assignees" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"role" "workspace_manager"."enum_workflow_definitions_stages_default_assignees_role" DEFAULT 'assignee' NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."workflow_definitions_stages_custom_fields_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."workflow_definitions_stages_custom_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field_name" varchar NOT NULL,
  	"field_type" "workspace_manager"."enum_workflow_definitions_stages_custom_fields_field_type" DEFAULT 'text' NOT NULL,
  	"is_required" boolean DEFAULT false
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."workflow_definitions_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"color" "workspace_manager"."enum_workflow_definitions_stages_color" DEFAULT 'blue' NOT NULL,
  	"order" numeric NOT NULL,
  	"requires_approval" boolean DEFAULT false
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."workflow_definitions_transition_rules_approvers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"user_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."workflow_definitions_transition_rules_required_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field_name" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."workflow_definitions_transition_rules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"from_stage" numeric NOT NULL,
  	"to_stage" numeric NOT NULL,
  	"condition" "workspace_manager"."enum_workflow_definitions_transition_rules_condition" DEFAULT 'always' NOT NULL,
  	"custom_rule" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."workflow_definitions_automations_specific_recipients" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"user_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."workflow_definitions_automations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"trigger_stage" numeric,
  	"trigger_type" "workspace_manager"."enum_workflow_definitions_automations_trigger_type" DEFAULT 'enter' NOT NULL,
  	"time_condition_amount" numeric,
  	"time_condition_unit" "workspace_manager"."enum_workflow_definitions_automations_time_condition_unit" DEFAULT 'days',
  	"action_type" "workspace_manager"."enum_workflow_definitions_automations_action_type" NOT NULL,
  	"assign_user_id" integer,
  	"notification_template" varchar,
  	"notification_recipients" "workspace_manager"."enum_workflow_definitions_automations_notification_recipients",
  	"priority_value" "workspace_manager"."enum_workflow_definitions_automations_priority_value",
  	"comment_text" varchar,
  	"target_stage" numeric,
  	"custom_action_code" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."workflow_definitions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"workspace_id" integer NOT NULL,
  	"is_default" boolean DEFAULT false,
  	"metadata" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."ai_conversations_messages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" "workspace_manager"."enum_ai_conversations_messages_role" DEFAULT 'user' NOT NULL,
  	"content" varchar NOT NULL,
  	"timestamp" timestamp(3) with time zone NOT NULL,
  	"metadata" jsonb
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."ai_conversations_context_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer NOT NULL,
  	"description" varchar,
  	"added_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."ai_conversations_generated_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer NOT NULL,
  	"description" varchar,
  	"generated_at" timestamp(3) with time zone NOT NULL,
  	"associated_message" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."ai_conversations_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."ai_conversations_favorites" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"message_index" numeric NOT NULL,
  	"description" varchar,
  	"added_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."ai_conversations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"user_id" integer NOT NULL,
  	"workspace_id" integer,
  	"project_id" integer,
  	"feature_id" integer,
  	"work_item_id" integer,
  	"model_name" "workspace_manager"."enum_ai_conversations_model_name" DEFAULT 'deepseek-coder' NOT NULL,
  	"custom_model_name" varchar,
  	"system_prompt" varchar,
  	"parameters" jsonb,
  	"is_archived" boolean DEFAULT false,
  	"metadata" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"tasks_id" integer,
  	"workspaces_id" integer,
  	"projects_id" integer,
  	"features_id" integer,
  	"work_items_id" integer,
  	"sessions_id" integer,
  	"recovery_points_id" integer,
  	"dependencies_id" integer,
  	"workflow_definitions_id" integer,
  	"ai_conversations_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "workspace_manager"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."users" ADD CONSTRAINT "users_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "workspace_manager"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."tasks_tags" ADD CONSTRAINT "tasks_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."tasks"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."tasks_dependencies" ADD CONSTRAINT "tasks_dependencies_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "workspace_manager"."tasks"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."tasks_dependencies" ADD CONSTRAINT "tasks_dependencies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."tasks"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."tasks_attachments" ADD CONSTRAINT "tasks_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "workspace_manager"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."tasks_attachments" ADD CONSTRAINT "tasks_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."tasks"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."tasks_comments" ADD CONSTRAINT "tasks_comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "workspace_manager"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."tasks_comments" ADD CONSTRAINT "tasks_comments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."tasks"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."tasks_time_tracking" ADD CONSTRAINT "tasks_time_tracking_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "workspace_manager"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."tasks_time_tracking" ADD CONSTRAINT "tasks_time_tracking_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."tasks"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."tasks" ADD CONSTRAINT "tasks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "workspace_manager"."projects"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."tasks" ADD CONSTRAINT "tasks_assignee_id_users_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "workspace_manager"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."tasks" ADD CONSTRAINT "tasks_parent_task_id_tasks_id_fk" FOREIGN KEY ("parent_task_id") REFERENCES "workspace_manager"."tasks"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."workspaces_members" ADD CONSTRAINT "workspaces_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "workspace_manager"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."workspaces_members" ADD CONSTRAINT "workspaces_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."workspaces_github_repositories" ADD CONSTRAINT "workspaces_github_repositories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."projects_assignees" ADD CONSTRAINT "projects_assignees_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "workspace_manager"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."projects_assignees" ADD CONSTRAINT "projects_assignees_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."projects_tags" ADD CONSTRAINT "projects_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."projects" ADD CONSTRAINT "projects_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace_manager"."workspaces"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."features_assignees" ADD CONSTRAINT "features_assignees_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "workspace_manager"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."features_assignees" ADD CONSTRAINT "features_assignees_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."features"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."features_tags" ADD CONSTRAINT "features_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."features"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."features_dependencies" ADD CONSTRAINT "features_dependencies_feature_id_features_id_fk" FOREIGN KEY ("feature_id") REFERENCES "workspace_manager"."features"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."features_dependencies" ADD CONSTRAINT "features_dependencies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."features"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."features_work_items" ADD CONSTRAINT "features_work_items_work_item_id_work_items_id_fk" FOREIGN KEY ("work_item_id") REFERENCES "workspace_manager"."work_items"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."features_work_items" ADD CONSTRAINT "features_work_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."features"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."features_attachments" ADD CONSTRAINT "features_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "workspace_manager"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."features_attachments" ADD CONSTRAINT "features_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."features"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."features_comments" ADD CONSTRAINT "features_comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "workspace_manager"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."features_comments" ADD CONSTRAINT "features_comments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."features"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."features_status_history" ADD CONSTRAINT "features_status_history_changed_by_id_users_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "workspace_manager"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."features_status_history" ADD CONSTRAINT "features_status_history_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."features"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."features_approvals" ADD CONSTRAINT "features_approvals_approver_id_users_id_fk" FOREIGN KEY ("approver_id") REFERENCES "workspace_manager"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."features_approvals" ADD CONSTRAINT "features_approvals_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."features"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."features" ADD CONSTRAINT "features_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "workspace_manager"."projects"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."features" ADD CONSTRAINT "features_workflow_definition_id_workflow_definitions_id_fk" FOREIGN KEY ("workflow_definition_id") REFERENCES "workspace_manager"."workflow_definitions"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."work_items_dependencies" ADD CONSTRAINT "work_items_dependencies_work_item_id_work_items_id_fk" FOREIGN KEY ("work_item_id") REFERENCES "workspace_manager"."work_items"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."work_items_dependencies" ADD CONSTRAINT "work_items_dependencies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."work_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."work_items_tags" ADD CONSTRAINT "work_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."work_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."work_items_attachments" ADD CONSTRAINT "work_items_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "workspace_manager"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."work_items_attachments" ADD CONSTRAINT "work_items_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."work_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."work_items_comments" ADD CONSTRAINT "work_items_comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "workspace_manager"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."work_items_comments" ADD CONSTRAINT "work_items_comments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."work_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."work_items_time_tracking" ADD CONSTRAINT "work_items_time_tracking_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "workspace_manager"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."work_items_time_tracking" ADD CONSTRAINT "work_items_time_tracking_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."work_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."work_items_status_history" ADD CONSTRAINT "work_items_status_history_changed_by_id_users_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "workspace_manager"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."work_items_status_history" ADD CONSTRAINT "work_items_status_history_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."work_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."work_items" ADD CONSTRAINT "work_items_feature_id_features_id_fk" FOREIGN KEY ("feature_id") REFERENCES "workspace_manager"."features"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."work_items" ADD CONSTRAINT "work_items_assignee_id_users_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "workspace_manager"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."sessions_time_entries" ADD CONSTRAINT "sessions_time_entries_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "workspace_manager"."tasks"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."sessions_time_entries" ADD CONSTRAINT "sessions_time_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."sessions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."sessions_recovery_points" ADD CONSTRAINT "sessions_recovery_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."sessions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."sessions_devices" ADD CONSTRAINT "sessions_devices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."sessions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "workspace_manager"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."sessions" ADD CONSTRAINT "sessions_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace_manager"."workspaces"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."sessions" ADD CONSTRAINT "sessions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "workspace_manager"."projects"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."sessions" ADD CONSTRAINT "sessions_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "workspace_manager"."tasks"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."recovery_points_tags" ADD CONSTRAINT "recovery_points_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."recovery_points"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."recovery_points" ADD CONSTRAINT "recovery_points_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "workspace_manager"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."recovery_points" ADD CONSTRAINT "recovery_points_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "workspace_manager"."sessions"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."recovery_points" ADD CONSTRAINT "recovery_points_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace_manager"."workspaces"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."recovery_points" ADD CONSTRAINT "recovery_points_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "workspace_manager"."projects"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."recovery_points" ADD CONSTRAINT "recovery_points_feature_id_features_id_fk" FOREIGN KEY ("feature_id") REFERENCES "workspace_manager"."features"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."recovery_points" ADD CONSTRAINT "recovery_points_thumbnail_image_id_media_id_fk" FOREIGN KEY ("thumbnail_image_id") REFERENCES "workspace_manager"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."dependencies" ADD CONSTRAINT "dependencies_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace_manager"."workspaces"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."dependencies" ADD CONSTRAINT "dependencies_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "workspace_manager"."projects"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."dependencies" ADD CONSTRAINT "dependencies_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "workspace_manager"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."dependencies" ADD CONSTRAINT "dependencies_resolved_by_id_users_id_fk" FOREIGN KEY ("resolved_by_id") REFERENCES "workspace_manager"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."workflow_definitions_stages_default_assignees" ADD CONSTRAINT "workflow_definitions_stages_default_assignees_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "workspace_manager"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."workflow_definitions_stages_default_assignees" ADD CONSTRAINT "workflow_definitions_stages_default_assignees_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."workflow_definitions_stages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."workflow_definitions_stages_custom_fields_options" ADD CONSTRAINT "workflow_definitions_stages_custom_fields_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."workflow_definitions_stages_custom_fields"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."workflow_definitions_stages_custom_fields" ADD CONSTRAINT "workflow_definitions_stages_custom_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."workflow_definitions_stages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."workflow_definitions_stages" ADD CONSTRAINT "workflow_definitions_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."workflow_definitions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."workflow_definitions_transition_rules_approvers" ADD CONSTRAINT "workflow_definitions_transition_rules_approvers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "workspace_manager"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."workflow_definitions_transition_rules_approvers" ADD CONSTRAINT "workflow_definitions_transition_rules_approvers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."workflow_definitions_transition_rules"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."workflow_definitions_transition_rules_required_fields" ADD CONSTRAINT "workflow_definitions_transition_rules_required_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."workflow_definitions_transition_rules"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."workflow_definitions_transition_rules" ADD CONSTRAINT "workflow_definitions_transition_rules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."workflow_definitions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."workflow_definitions_automations_specific_recipients" ADD CONSTRAINT "workflow_definitions_automations_specific_recipients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "workspace_manager"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."workflow_definitions_automations_specific_recipients" ADD CONSTRAINT "workflow_definitions_automations_specific_recipients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."workflow_definitions_automations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."workflow_definitions_automations" ADD CONSTRAINT "workflow_definitions_automations_assign_user_id_users_id_fk" FOREIGN KEY ("assign_user_id") REFERENCES "workspace_manager"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."workflow_definitions_automations" ADD CONSTRAINT "workflow_definitions_automations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."workflow_definitions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."workflow_definitions" ADD CONSTRAINT "workflow_definitions_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace_manager"."workspaces"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."ai_conversations_messages" ADD CONSTRAINT "ai_conversations_messages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."ai_conversations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."ai_conversations_context_files" ADD CONSTRAINT "ai_conversations_context_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "workspace_manager"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."ai_conversations_context_files" ADD CONSTRAINT "ai_conversations_context_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."ai_conversations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."ai_conversations_generated_files" ADD CONSTRAINT "ai_conversations_generated_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "workspace_manager"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."ai_conversations_generated_files" ADD CONSTRAINT "ai_conversations_generated_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."ai_conversations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."ai_conversations_tags" ADD CONSTRAINT "ai_conversations_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."ai_conversations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."ai_conversations_favorites" ADD CONSTRAINT "ai_conversations_favorites_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "workspace_manager"."ai_conversations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."ai_conversations" ADD CONSTRAINT "ai_conversations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "workspace_manager"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."ai_conversations" ADD CONSTRAINT "ai_conversations_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace_manager"."workspaces"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."ai_conversations" ADD CONSTRAINT "ai_conversations_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "workspace_manager"."projects"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."ai_conversations" ADD CONSTRAINT "ai_conversations_feature_id_features_id_fk" FOREIGN KEY ("feature_id") REFERENCES "workspace_manager"."features"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."ai_conversations" ADD CONSTRAINT "ai_conversations_work_item_id_work_items_id_fk" FOREIGN KEY ("work_item_id") REFERENCES "workspace_manager"."work_items"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "workspace_manager"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "workspace_manager"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "workspace_manager"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tasks_fk" FOREIGN KEY ("tasks_id") REFERENCES "workspace_manager"."tasks"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_workspaces_fk" FOREIGN KEY ("workspaces_id") REFERENCES "workspace_manager"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "workspace_manager"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_features_fk" FOREIGN KEY ("features_id") REFERENCES "workspace_manager"."features"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_work_items_fk" FOREIGN KEY ("work_items_id") REFERENCES "workspace_manager"."work_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sessions_fk" FOREIGN KEY ("sessions_id") REFERENCES "workspace_manager"."sessions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_recovery_points_fk" FOREIGN KEY ("recovery_points_id") REFERENCES "workspace_manager"."recovery_points"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_dependencies_fk" FOREIGN KEY ("dependencies_id") REFERENCES "workspace_manager"."dependencies"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_workflow_definitions_fk" FOREIGN KEY ("workflow_definitions_id") REFERENCES "workspace_manager"."workflow_definitions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ai_conversations_fk" FOREIGN KEY ("ai_conversations_id") REFERENCES "workspace_manager"."ai_conversations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "workspace_manager"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "workspace_manager"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "workspace_manager"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "users_profile_image_idx" ON "workspace_manager"."users" USING btree ("profile_image_id");
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "workspace_manager"."users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "workspace_manager"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "workspace_manager"."users" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "workspace_manager"."media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "workspace_manager"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "workspace_manager"."media" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "tasks_tags_order_idx" ON "workspace_manager"."tasks_tags" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "tasks_tags_parent_id_idx" ON "workspace_manager"."tasks_tags" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "tasks_dependencies_order_idx" ON "workspace_manager"."tasks_dependencies" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "tasks_dependencies_parent_id_idx" ON "workspace_manager"."tasks_dependencies" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "tasks_dependencies_task_idx" ON "workspace_manager"."tasks_dependencies" USING btree ("task_id");
  CREATE INDEX IF NOT EXISTS "tasks_attachments_order_idx" ON "workspace_manager"."tasks_attachments" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "tasks_attachments_parent_id_idx" ON "workspace_manager"."tasks_attachments" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "tasks_attachments_file_idx" ON "workspace_manager"."tasks_attachments" USING btree ("file_id");
  CREATE INDEX IF NOT EXISTS "tasks_comments_order_idx" ON "workspace_manager"."tasks_comments" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "tasks_comments_parent_id_idx" ON "workspace_manager"."tasks_comments" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "tasks_comments_author_idx" ON "workspace_manager"."tasks_comments" USING btree ("author_id");
  CREATE INDEX IF NOT EXISTS "tasks_time_tracking_order_idx" ON "workspace_manager"."tasks_time_tracking" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "tasks_time_tracking_parent_id_idx" ON "workspace_manager"."tasks_time_tracking" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "tasks_time_tracking_user_idx" ON "workspace_manager"."tasks_time_tracking" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "tasks_project_idx" ON "workspace_manager"."tasks" USING btree ("project_id");
  CREATE INDEX IF NOT EXISTS "tasks_assignee_idx" ON "workspace_manager"."tasks" USING btree ("assignee_id");
  CREATE INDEX IF NOT EXISTS "tasks_parent_task_idx" ON "workspace_manager"."tasks" USING btree ("parent_task_id");
  CREATE INDEX IF NOT EXISTS "tasks_updated_at_idx" ON "workspace_manager"."tasks" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "tasks_created_at_idx" ON "workspace_manager"."tasks" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "workspaces_members_order_idx" ON "workspace_manager"."workspaces_members" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "workspaces_members_parent_id_idx" ON "workspace_manager"."workspaces_members" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "workspaces_members_user_idx" ON "workspace_manager"."workspaces_members" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "workspaces_github_repositories_order_idx" ON "workspace_manager"."workspaces_github_repositories" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "workspaces_github_repositories_parent_id_idx" ON "workspace_manager"."workspaces_github_repositories" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "workspaces_updated_at_idx" ON "workspace_manager"."workspaces" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "workspaces_created_at_idx" ON "workspace_manager"."workspaces" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "projects_assignees_order_idx" ON "workspace_manager"."projects_assignees" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_assignees_parent_id_idx" ON "workspace_manager"."projects_assignees" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "projects_assignees_user_idx" ON "workspace_manager"."projects_assignees" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "projects_tags_order_idx" ON "workspace_manager"."projects_tags" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_tags_parent_id_idx" ON "workspace_manager"."projects_tags" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "projects_workspace_idx" ON "workspace_manager"."projects" USING btree ("workspace_id");
  CREATE INDEX IF NOT EXISTS "projects_updated_at_idx" ON "workspace_manager"."projects" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "projects_created_at_idx" ON "workspace_manager"."projects" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "features_assignees_order_idx" ON "workspace_manager"."features_assignees" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "features_assignees_parent_id_idx" ON "workspace_manager"."features_assignees" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "features_assignees_user_idx" ON "workspace_manager"."features_assignees" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "features_tags_order_idx" ON "workspace_manager"."features_tags" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "features_tags_parent_id_idx" ON "workspace_manager"."features_tags" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "features_dependencies_order_idx" ON "workspace_manager"."features_dependencies" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "features_dependencies_parent_id_idx" ON "workspace_manager"."features_dependencies" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "features_dependencies_feature_idx" ON "workspace_manager"."features_dependencies" USING btree ("feature_id");
  CREATE INDEX IF NOT EXISTS "features_work_items_order_idx" ON "workspace_manager"."features_work_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "features_work_items_parent_id_idx" ON "workspace_manager"."features_work_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "features_work_items_work_item_idx" ON "workspace_manager"."features_work_items" USING btree ("work_item_id");
  CREATE INDEX IF NOT EXISTS "features_attachments_order_idx" ON "workspace_manager"."features_attachments" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "features_attachments_parent_id_idx" ON "workspace_manager"."features_attachments" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "features_attachments_file_idx" ON "workspace_manager"."features_attachments" USING btree ("file_id");
  CREATE INDEX IF NOT EXISTS "features_comments_order_idx" ON "workspace_manager"."features_comments" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "features_comments_parent_id_idx" ON "workspace_manager"."features_comments" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "features_comments_author_idx" ON "workspace_manager"."features_comments" USING btree ("author_id");
  CREATE INDEX IF NOT EXISTS "features_status_history_order_idx" ON "workspace_manager"."features_status_history" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "features_status_history_parent_id_idx" ON "workspace_manager"."features_status_history" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "features_status_history_changed_by_idx" ON "workspace_manager"."features_status_history" USING btree ("changed_by_id");
  CREATE INDEX IF NOT EXISTS "features_approvals_order_idx" ON "workspace_manager"."features_approvals" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "features_approvals_parent_id_idx" ON "workspace_manager"."features_approvals" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "features_approvals_approver_idx" ON "workspace_manager"."features_approvals" USING btree ("approver_id");
  CREATE INDEX IF NOT EXISTS "features_project_idx" ON "workspace_manager"."features" USING btree ("project_id");
  CREATE INDEX IF NOT EXISTS "features_workflow_definition_idx" ON "workspace_manager"."features" USING btree ("workflow_definition_id");
  CREATE INDEX IF NOT EXISTS "features_updated_at_idx" ON "workspace_manager"."features" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "features_created_at_idx" ON "workspace_manager"."features" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "work_items_dependencies_order_idx" ON "workspace_manager"."work_items_dependencies" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "work_items_dependencies_parent_id_idx" ON "workspace_manager"."work_items_dependencies" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "work_items_dependencies_work_item_idx" ON "workspace_manager"."work_items_dependencies" USING btree ("work_item_id");
  CREATE INDEX IF NOT EXISTS "work_items_tags_order_idx" ON "workspace_manager"."work_items_tags" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "work_items_tags_parent_id_idx" ON "workspace_manager"."work_items_tags" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "work_items_attachments_order_idx" ON "workspace_manager"."work_items_attachments" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "work_items_attachments_parent_id_idx" ON "workspace_manager"."work_items_attachments" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "work_items_attachments_file_idx" ON "workspace_manager"."work_items_attachments" USING btree ("file_id");
  CREATE INDEX IF NOT EXISTS "work_items_comments_order_idx" ON "workspace_manager"."work_items_comments" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "work_items_comments_parent_id_idx" ON "workspace_manager"."work_items_comments" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "work_items_comments_author_idx" ON "workspace_manager"."work_items_comments" USING btree ("author_id");
  CREATE INDEX IF NOT EXISTS "work_items_time_tracking_order_idx" ON "workspace_manager"."work_items_time_tracking" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "work_items_time_tracking_parent_id_idx" ON "workspace_manager"."work_items_time_tracking" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "work_items_time_tracking_user_idx" ON "workspace_manager"."work_items_time_tracking" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "work_items_status_history_order_idx" ON "workspace_manager"."work_items_status_history" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "work_items_status_history_parent_id_idx" ON "workspace_manager"."work_items_status_history" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "work_items_status_history_changed_by_idx" ON "workspace_manager"."work_items_status_history" USING btree ("changed_by_id");
  CREATE INDEX IF NOT EXISTS "work_items_feature_idx" ON "workspace_manager"."work_items" USING btree ("feature_id");
  CREATE INDEX IF NOT EXISTS "work_items_assignee_idx" ON "workspace_manager"."work_items" USING btree ("assignee_id");
  CREATE INDEX IF NOT EXISTS "work_items_updated_at_idx" ON "workspace_manager"."work_items" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "work_items_created_at_idx" ON "workspace_manager"."work_items" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "sessions_time_entries_order_idx" ON "workspace_manager"."sessions_time_entries" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "sessions_time_entries_parent_id_idx" ON "workspace_manager"."sessions_time_entries" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "sessions_time_entries_task_idx" ON "workspace_manager"."sessions_time_entries" USING btree ("task_id");
  CREATE INDEX IF NOT EXISTS "sessions_recovery_points_order_idx" ON "workspace_manager"."sessions_recovery_points" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "sessions_recovery_points_parent_id_idx" ON "workspace_manager"."sessions_recovery_points" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "sessions_devices_order_idx" ON "workspace_manager"."sessions_devices" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "sessions_devices_parent_id_idx" ON "workspace_manager"."sessions_devices" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "sessions_user_idx" ON "workspace_manager"."sessions" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "sessions_workspace_idx" ON "workspace_manager"."sessions" USING btree ("workspace_id");
  CREATE INDEX IF NOT EXISTS "sessions_project_idx" ON "workspace_manager"."sessions" USING btree ("project_id");
  CREATE INDEX IF NOT EXISTS "sessions_task_idx" ON "workspace_manager"."sessions" USING btree ("task_id");
  CREATE INDEX IF NOT EXISTS "sessions_updated_at_idx" ON "workspace_manager"."sessions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "sessions_created_at_idx" ON "workspace_manager"."sessions" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "recovery_points_tags_order_idx" ON "workspace_manager"."recovery_points_tags" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "recovery_points_tags_parent_id_idx" ON "workspace_manager"."recovery_points_tags" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "recovery_points_user_idx" ON "workspace_manager"."recovery_points" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "recovery_points_session_idx" ON "workspace_manager"."recovery_points" USING btree ("session_id");
  CREATE INDEX IF NOT EXISTS "recovery_points_workspace_idx" ON "workspace_manager"."recovery_points" USING btree ("workspace_id");
  CREATE INDEX IF NOT EXISTS "recovery_points_project_idx" ON "workspace_manager"."recovery_points" USING btree ("project_id");
  CREATE INDEX IF NOT EXISTS "recovery_points_feature_idx" ON "workspace_manager"."recovery_points" USING btree ("feature_id");
  CREATE INDEX IF NOT EXISTS "recovery_points_thumbnail_image_idx" ON "workspace_manager"."recovery_points" USING btree ("thumbnail_image_id");
  CREATE INDEX IF NOT EXISTS "recovery_points_updated_at_idx" ON "workspace_manager"."recovery_points" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "recovery_points_created_at_idx" ON "workspace_manager"."recovery_points" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "dependencies_workspace_idx" ON "workspace_manager"."dependencies" USING btree ("workspace_id");
  CREATE INDEX IF NOT EXISTS "dependencies_project_idx" ON "workspace_manager"."dependencies" USING btree ("project_id");
  CREATE INDEX IF NOT EXISTS "dependencies_created_by_idx" ON "workspace_manager"."dependencies" USING btree ("created_by_id");
  CREATE INDEX IF NOT EXISTS "dependencies_resolved_by_idx" ON "workspace_manager"."dependencies" USING btree ("resolved_by_id");
  CREATE INDEX IF NOT EXISTS "dependencies_updated_at_idx" ON "workspace_manager"."dependencies" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "dependencies_created_at_idx" ON "workspace_manager"."dependencies" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "workflow_definitions_stages_default_assignees_order_idx" ON "workspace_manager"."workflow_definitions_stages_default_assignees" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "workflow_definitions_stages_default_assignees_parent_id_idx" ON "workspace_manager"."workflow_definitions_stages_default_assignees" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "workflow_definitions_stages_default_assignees_user_idx" ON "workspace_manager"."workflow_definitions_stages_default_assignees" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "workflow_definitions_stages_custom_fields_options_order_idx" ON "workspace_manager"."workflow_definitions_stages_custom_fields_options" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "workflow_definitions_stages_custom_fields_options_parent_id_idx" ON "workspace_manager"."workflow_definitions_stages_custom_fields_options" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "workflow_definitions_stages_custom_fields_order_idx" ON "workspace_manager"."workflow_definitions_stages_custom_fields" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "workflow_definitions_stages_custom_fields_parent_id_idx" ON "workspace_manager"."workflow_definitions_stages_custom_fields" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "workflow_definitions_stages_order_idx" ON "workspace_manager"."workflow_definitions_stages" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "workflow_definitions_stages_parent_id_idx" ON "workspace_manager"."workflow_definitions_stages" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "workflow_definitions_transition_rules_approvers_order_idx" ON "workspace_manager"."workflow_definitions_transition_rules_approvers" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "workflow_definitions_transition_rules_approvers_parent_id_idx" ON "workspace_manager"."workflow_definitions_transition_rules_approvers" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "workflow_definitions_transition_rules_approvers_user_idx" ON "workspace_manager"."workflow_definitions_transition_rules_approvers" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "workflow_definitions_transition_rules_required_fields_order_idx" ON "workspace_manager"."workflow_definitions_transition_rules_required_fields" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "workflow_definitions_transition_rules_required_fields_parent_id_idx" ON "workspace_manager"."workflow_definitions_transition_rules_required_fields" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "workflow_definitions_transition_rules_order_idx" ON "workspace_manager"."workflow_definitions_transition_rules" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "workflow_definitions_transition_rules_parent_id_idx" ON "workspace_manager"."workflow_definitions_transition_rules" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "workflow_definitions_automations_specific_recipients_order_idx" ON "workspace_manager"."workflow_definitions_automations_specific_recipients" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "workflow_definitions_automations_specific_recipients_parent_id_idx" ON "workspace_manager"."workflow_definitions_automations_specific_recipients" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "workflow_definitions_automations_specific_recipients_user_idx" ON "workspace_manager"."workflow_definitions_automations_specific_recipients" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "workflow_definitions_automations_order_idx" ON "workspace_manager"."workflow_definitions_automations" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "workflow_definitions_automations_parent_id_idx" ON "workspace_manager"."workflow_definitions_automations" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "workflow_definitions_automations_assign_user_idx" ON "workspace_manager"."workflow_definitions_automations" USING btree ("assign_user_id");
  CREATE INDEX IF NOT EXISTS "workflow_definitions_workspace_idx" ON "workspace_manager"."workflow_definitions" USING btree ("workspace_id");
  CREATE INDEX IF NOT EXISTS "workflow_definitions_updated_at_idx" ON "workspace_manager"."workflow_definitions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "workflow_definitions_created_at_idx" ON "workspace_manager"."workflow_definitions" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "ai_conversations_messages_order_idx" ON "workspace_manager"."ai_conversations_messages" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "ai_conversations_messages_parent_id_idx" ON "workspace_manager"."ai_conversations_messages" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "ai_conversations_context_files_order_idx" ON "workspace_manager"."ai_conversations_context_files" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "ai_conversations_context_files_parent_id_idx" ON "workspace_manager"."ai_conversations_context_files" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "ai_conversations_context_files_file_idx" ON "workspace_manager"."ai_conversations_context_files" USING btree ("file_id");
  CREATE INDEX IF NOT EXISTS "ai_conversations_generated_files_order_idx" ON "workspace_manager"."ai_conversations_generated_files" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "ai_conversations_generated_files_parent_id_idx" ON "workspace_manager"."ai_conversations_generated_files" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "ai_conversations_generated_files_file_idx" ON "workspace_manager"."ai_conversations_generated_files" USING btree ("file_id");
  CREATE INDEX IF NOT EXISTS "ai_conversations_tags_order_idx" ON "workspace_manager"."ai_conversations_tags" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "ai_conversations_tags_parent_id_idx" ON "workspace_manager"."ai_conversations_tags" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "ai_conversations_favorites_order_idx" ON "workspace_manager"."ai_conversations_favorites" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "ai_conversations_favorites_parent_id_idx" ON "workspace_manager"."ai_conversations_favorites" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "ai_conversations_user_idx" ON "workspace_manager"."ai_conversations" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "ai_conversations_workspace_idx" ON "workspace_manager"."ai_conversations" USING btree ("workspace_id");
  CREATE INDEX IF NOT EXISTS "ai_conversations_project_idx" ON "workspace_manager"."ai_conversations" USING btree ("project_id");
  CREATE INDEX IF NOT EXISTS "ai_conversations_feature_idx" ON "workspace_manager"."ai_conversations" USING btree ("feature_id");
  CREATE INDEX IF NOT EXISTS "ai_conversations_work_item_idx" ON "workspace_manager"."ai_conversations" USING btree ("work_item_id");
  CREATE INDEX IF NOT EXISTS "ai_conversations_updated_at_idx" ON "workspace_manager"."ai_conversations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "ai_conversations_created_at_idx" ON "workspace_manager"."ai_conversations" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "workspace_manager"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "workspace_manager"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "workspace_manager"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "workspace_manager"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "workspace_manager"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "workspace_manager"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "workspace_manager"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "workspace_manager"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_tasks_id_idx" ON "workspace_manager"."payload_locked_documents_rels" USING btree ("tasks_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_workspaces_id_idx" ON "workspace_manager"."payload_locked_documents_rels" USING btree ("workspaces_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_projects_id_idx" ON "workspace_manager"."payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_features_id_idx" ON "workspace_manager"."payload_locked_documents_rels" USING btree ("features_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_work_items_id_idx" ON "workspace_manager"."payload_locked_documents_rels" USING btree ("work_items_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_sessions_id_idx" ON "workspace_manager"."payload_locked_documents_rels" USING btree ("sessions_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_recovery_points_id_idx" ON "workspace_manager"."payload_locked_documents_rels" USING btree ("recovery_points_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_dependencies_id_idx" ON "workspace_manager"."payload_locked_documents_rels" USING btree ("dependencies_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_workflow_definitions_id_idx" ON "workspace_manager"."payload_locked_documents_rels" USING btree ("workflow_definitions_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_ai_conversations_id_idx" ON "workspace_manager"."payload_locked_documents_rels" USING btree ("ai_conversations_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "workspace_manager"."payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "workspace_manager"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "workspace_manager"."payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "workspace_manager"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "workspace_manager"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "workspace_manager"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "workspace_manager"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "workspace_manager"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "workspace_manager"."payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "workspace_manager"."users" CASCADE;
  DROP TABLE "workspace_manager"."media" CASCADE;
  DROP TABLE "workspace_manager"."tasks_tags" CASCADE;
  DROP TABLE "workspace_manager"."tasks_dependencies" CASCADE;
  DROP TABLE "workspace_manager"."tasks_attachments" CASCADE;
  DROP TABLE "workspace_manager"."tasks_comments" CASCADE;
  DROP TABLE "workspace_manager"."tasks_time_tracking" CASCADE;
  DROP TABLE "workspace_manager"."tasks" CASCADE;
  DROP TABLE "workspace_manager"."workspaces_members" CASCADE;
  DROP TABLE "workspace_manager"."workspaces_github_repositories" CASCADE;
  DROP TABLE "workspace_manager"."workspaces" CASCADE;
  DROP TABLE "workspace_manager"."projects_assignees" CASCADE;
  DROP TABLE "workspace_manager"."projects_tags" CASCADE;
  DROP TABLE "workspace_manager"."projects" CASCADE;
  DROP TABLE "workspace_manager"."features_assignees" CASCADE;
  DROP TABLE "workspace_manager"."features_tags" CASCADE;
  DROP TABLE "workspace_manager"."features_dependencies" CASCADE;
  DROP TABLE "workspace_manager"."features_work_items" CASCADE;
  DROP TABLE "workspace_manager"."features_attachments" CASCADE;
  DROP TABLE "workspace_manager"."features_comments" CASCADE;
  DROP TABLE "workspace_manager"."features_status_history" CASCADE;
  DROP TABLE "workspace_manager"."features_approvals" CASCADE;
  DROP TABLE "workspace_manager"."features" CASCADE;
  DROP TABLE "workspace_manager"."work_items_dependencies" CASCADE;
  DROP TABLE "workspace_manager"."work_items_tags" CASCADE;
  DROP TABLE "workspace_manager"."work_items_attachments" CASCADE;
  DROP TABLE "workspace_manager"."work_items_comments" CASCADE;
  DROP TABLE "workspace_manager"."work_items_time_tracking" CASCADE;
  DROP TABLE "workspace_manager"."work_items_status_history" CASCADE;
  DROP TABLE "workspace_manager"."work_items" CASCADE;
  DROP TABLE "workspace_manager"."sessions_time_entries" CASCADE;
  DROP TABLE "workspace_manager"."sessions_recovery_points" CASCADE;
  DROP TABLE "workspace_manager"."sessions_devices" CASCADE;
  DROP TABLE "workspace_manager"."sessions" CASCADE;
  DROP TABLE "workspace_manager"."recovery_points_tags" CASCADE;
  DROP TABLE "workspace_manager"."recovery_points" CASCADE;
  DROP TABLE "workspace_manager"."dependencies" CASCADE;
  DROP TABLE "workspace_manager"."workflow_definitions_stages_default_assignees" CASCADE;
  DROP TABLE "workspace_manager"."workflow_definitions_stages_custom_fields_options" CASCADE;
  DROP TABLE "workspace_manager"."workflow_definitions_stages_custom_fields" CASCADE;
  DROP TABLE "workspace_manager"."workflow_definitions_stages" CASCADE;
  DROP TABLE "workspace_manager"."workflow_definitions_transition_rules_approvers" CASCADE;
  DROP TABLE "workspace_manager"."workflow_definitions_transition_rules_required_fields" CASCADE;
  DROP TABLE "workspace_manager"."workflow_definitions_transition_rules" CASCADE;
  DROP TABLE "workspace_manager"."workflow_definitions_automations_specific_recipients" CASCADE;
  DROP TABLE "workspace_manager"."workflow_definitions_automations" CASCADE;
  DROP TABLE "workspace_manager"."workflow_definitions" CASCADE;
  DROP TABLE "workspace_manager"."ai_conversations_messages" CASCADE;
  DROP TABLE "workspace_manager"."ai_conversations_context_files" CASCADE;
  DROP TABLE "workspace_manager"."ai_conversations_generated_files" CASCADE;
  DROP TABLE "workspace_manager"."ai_conversations_tags" CASCADE;
  DROP TABLE "workspace_manager"."ai_conversations_favorites" CASCADE;
  DROP TABLE "workspace_manager"."ai_conversations" CASCADE;
  DROP TABLE "workspace_manager"."payload_locked_documents" CASCADE;
  DROP TABLE "workspace_manager"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "workspace_manager"."payload_preferences" CASCADE;
  DROP TABLE "workspace_manager"."payload_preferences_rels" CASCADE;
  DROP TABLE "workspace_manager"."payload_migrations" CASCADE;
  DROP TYPE "workspace_manager"."enum_users_role";
  DROP TYPE "workspace_manager"."enum_tasks_dependencies_type";
  DROP TYPE "workspace_manager"."enum_tasks_status";
  DROP TYPE "workspace_manager"."enum_tasks_priority";
  DROP TYPE "workspace_manager"."enum_workspaces_members_role";
  DROP TYPE "workspace_manager"."enum_workspaces_icon";
  DROP TYPE "workspace_manager"."enum_workspaces_color";
  DROP TYPE "workspace_manager"."enum_projects_assignees_role";
  DROP TYPE "workspace_manager"."enum_projects_status";
  DROP TYPE "workspace_manager"."enum_projects_priority";
  DROP TYPE "workspace_manager"."enum_features_assignees_role";
  DROP TYPE "workspace_manager"."enum_features_dependencies_type";
  DROP TYPE "workspace_manager"."enum_features_dependencies_strength";
  DROP TYPE "workspace_manager"."enum_features_approvals_status";
  DROP TYPE "workspace_manager"."enum_features_status";
  DROP TYPE "workspace_manager"."enum_features_priority";
  DROP TYPE "workspace_manager"."enum_work_items_dependencies_type";
  DROP TYPE "workspace_manager"."enum_work_items_type";
  DROP TYPE "workspace_manager"."enum_work_items_status";
  DROP TYPE "workspace_manager"."enum_work_items_priority";
  DROP TYPE "workspace_manager"."enum_sessions_time_entries_type";
  DROP TYPE "workspace_manager"."enum_sessions_recovery_points_type";
  DROP TYPE "workspace_manager"."enum_sessions_status";
  DROP TYPE "workspace_manager"."enum_recovery_points_type";
  DROP TYPE "workspace_manager"."enum_dependencies_source_type";
  DROP TYPE "workspace_manager"."enum_dependencies_target_type";
  DROP TYPE "workspace_manager"."enum_dependencies_type";
  DROP TYPE "workspace_manager"."enum_dependencies_strength";
  DROP TYPE "workspace_manager"."enum_dependencies_state";
  DROP TYPE "workspace_manager"."enum_workflow_definitions_stages_default_assignees_role";
  DROP TYPE "workspace_manager"."enum_workflow_definitions_stages_custom_fields_field_type";
  DROP TYPE "workspace_manager"."enum_workflow_definitions_stages_color";
  DROP TYPE "workspace_manager"."enum_workflow_definitions_transition_rules_condition";
  DROP TYPE "workspace_manager"."enum_workflow_definitions_automations_trigger_type";
  DROP TYPE "workspace_manager"."enum_workflow_definitions_automations_time_condition_unit";
  DROP TYPE "workspace_manager"."enum_workflow_definitions_automations_action_type";
  DROP TYPE "workspace_manager"."enum_workflow_definitions_automations_notification_recipients";
  DROP TYPE "workspace_manager"."enum_workflow_definitions_automations_priority_value";
  DROP TYPE "workspace_manager"."enum_ai_conversations_messages_role";
  DROP TYPE "workspace_manager"."enum_ai_conversations_model_name";`)
}
