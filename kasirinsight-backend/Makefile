project=gin-app
SHELL := bash

model:
	@if [ -z "$(mn)" ]; then \
		echo "❌ Please provide mn (Model Name), e.g. make model mn=Product"; \
		exit 1; \
	fi

	@echo -n "Generating Go Model $(mn)"
	@for i in 1 2 3 4 5 6; do \
		echo -n "."; \
		sleep 0.3; \
	done
	@echo ""

	@mkdir -p models

	@props=""; \
	if [ -n "$(field)" ]; then \
		IFS=',' read -ra fields <<< "$(field)"; \
		for f in "$${fields[@]}"; do \
			if [[ $$f =~ ^(.+)-([sifb])$$ ]]; then \
				name=$${BASH_REMATCH[1]}; \
				type_code=$${BASH_REMATCH[2]}; \
				case $$type_code in \
					s) type="string" ;; \
					i) type="int" ;; \
					f) type="float64" ;; \
					b) type="bool" ;; \
				esac; \
				json=$$(echo $$name | sed -E 's/([a-z])([A-Z])/\1_\2/g' | tr 'A-Z' 'a-z'); \
				props="$$props\n\t$$name $$type \`json:\"$$json\"\`"; \
			fi; \
		done; \
	fi; \
	file=$$(echo $(mn) | sed -E 's/([a-z])([A-Z])/\1_\2/g' | tr 'A-Z' 'a-z'); \
	tmpfile=$$(mktemp); \
	cp makesrc/model.go.txt $$tmpfile; \
	sed -i "s/{mn}/$(mn)/g" $$tmpfile; \
	printf "$$props" > props.tmp; \
	sed -i "/{properties}/r props.tmp" $$tmpfile; \
	sed -i "s/{properties}//g" $$tmpfile; \
	mv $$tmpfile models/$$file.go; \
	rm props.tmp

	@echo "Go Model $(mn) Created Successfully!"


controller:
	@if [ -z "$(mn)" ]; then \
		echo "❌ Please provide mn (Model Name), e.g. make controller mn=Product"; \
		exit 1; \
	fi

	@echo -n "Generating Controller $(mn)"
	@for i in 1 2 3 4 5 6; do \
		echo -n "."; \
		sleep 0.3; \
	done
	@echo ""

	@mkdir -p controllers

	@file=$$(echo $(mn) | sed -E 's/([a-z])([A-Z])/\1_\2/g' | tr 'A-Z' 'a-z'); \
	sed "s/{mn}/$(mn)/g; s/{project}/$(project)/g" makesrc/controller.go.txt > controllers/$${file}_controller.go

	@echo "Controller $(mn) Created Successfully!"

mc: model controller

route:
	@if [ -z "$(mn)" ]; then \
		echo "❌ Please provide mn (Model Name), e.g. make route mn=Product"; \
		exit 1; \
	fi

	@echo -n "Adding Routes $(mn)"
	@for i in 1 2 3 4 5 6; do \
		echo -n "."; \
		sleep 0.3; \
	done
	@echo ""

	@name="$(mn)"; \
	snake=$$(echo $$name | sed -E 's/([a-z])([A-Z])/\1_\2/g' | tr 'A-Z' 'a-z'); \
	plural="$${snake}s"; \
	file="routes/routes.go"; \
	\
	block="\n	auth.POST(\"/$${plural}\", controllers.Create$(mn))\n\
		auth.GET(\"/$${plural}\", controllers.GetAll$(mn)s)\n\
		auth.GET(\"/$${plural}/:id\", controllers.Get$(mn))\n\
		auth.PUT(\"/$${plural}/:id\", controllers.Update$(mn))\n\
		auth.DELETE(\"/$${plural}/:id\", controllers.Delete$(mn))\n"; \
	\
	if grep -q "auth.POST(\"/$${plural}\"" $$file; then \
		echo "⚠️ Routes already exist!"; \
		exit 0; \
	fi; \
	\
	tmpfile=$$(mktemp); \
	inserted=0; \
	while IFS= read -r line; do \
		echo "$$line" >> $$tmpfile; \
		if [[ $$inserted -eq 0 && $$line =~ auth\.Use.*AuthMiddleware ]]; then \
			printf "$$block" >> $$tmpfile; \
			inserted=1; \
		fi; \
	done < $$file; \
	\
	if [ $$inserted -eq 1 ]; then \
		mv $$tmpfile $$file; \
		echo "Done!"; \
	else \
		rm $$tmpfile; \
		echo "❌ Could not find AuthMiddleware block"; \
	fi

	@echo "Routes $(mn) Added Successfully!"


mcr: model controller route

DB_URL=mysql://root@tcp(127.0.0.1:3306)/gin_db?charset=utf8mb4&parseTime=True&loc=Local

migrate-create:
	@echo "Creating migration for $(name)..."
	@migrate create -ext sql -dir migrations -seq $(name)

	@latest=$$(ls -t migrations/*_$(name).up.sql | head -n 1); \
	table=$$(echo $(name) | sed -E 's/create_|_table//g'); \
	snake=$$(echo $$table | sed -E 's/([a-z])([A-Z])/\1_\2/g' | tr 'A-Z' 'a-z'); \
	\
	echo "Generating template for $$snake..."; \
	\
	echo "CREATE TABLE \`$$snake\` (" > $$latest; \
	echo "  \`id\` bigint(20) unsigned NOT NULL AUTO_INCREMENT," >> $$latest; \
	echo "  \`created_at\` datetime(3) DEFAULT NULL," >> $$latest; \
	echo "  \`updated_at\` datetime(3) DEFAULT NULL," >> $$latest; \
	echo "  \`deleted_at\` datetime(3) DEFAULT NULL," >> $$latest; \
	echo "  PRIMARY KEY (\`id\`)," >> $$latest; \
	echo "  KEY \`idx_$${snake}_deleted_at\` (\`deleted_at\`)" >> $$latest; \
	echo ");" >> $$latest; \
	\
	down_file=$$(echo $$latest | sed 's/.up.sql/.down.sql/'); \
	echo "DROP TABLE \`$$snake\`;" > $$down_file

migrate-up:
	migrate -path migrations -database "$(DB_URL)" up

migrate-down:
	migrate -path migrations -database "$(DB_URL)" down 1